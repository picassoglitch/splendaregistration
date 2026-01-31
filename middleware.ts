import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

type SupabaseUserLike = { email?: string | null; email_confirmed_at?: string | null; confirmed_at?: string | null };

function isEmailConfirmed(user: SupabaseUserLike | null | undefined) {
  return Boolean(user?.email_confirmed_at || user?.confirmed_at);
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return res;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          res.cookies.set(name, value, options);
        });
      },
    },
  });

  // refresh session if needed
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect app routes: require logged-in + confirmed email
  const { pathname } = req.nextUrl;
  const isProtected =
    pathname === "/home" ||
    pathname.startsWith("/agenda") ||
    pathname.startsWith("/mapa") ||
    pathname.startsWith("/admin");

  if (isProtected) {
    if (!user || !isEmailConfirmed(user)) {
      const login = new URL("/", req.url);
      if (user?.email && !isEmailConfirmed(user)) {
        login.searchParams.set("unconfirmed", "1");
        login.searchParams.set("email", user.email);
      }
      return NextResponse.redirect(login);
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
      Run on all routes except:
      - static files
      - next internal
      - supabase edge functions (none here)
    */
    "/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|sw.js).*)",
  ],
};

