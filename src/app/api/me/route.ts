import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user ?? null;
  if (!user || !session?.access_token) {
    return NextResponse.json(
      { user: null, role: null },
      { headers: { "cache-control": "no-store" } },
    );
  }

  // Use an explicit Authorization header to ensure PostgREST has the JWT (RLS/auth.uid()).
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const db = createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${session.access_token}` } },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  const { data: profile } = await db
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return NextResponse.json(
    {
      user: { id: user.id, email: user.email },
      role: profile?.role ?? null,
    },
    { headers: { "cache-control": "no-store" } },
  );
}

