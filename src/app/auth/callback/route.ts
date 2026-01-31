import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  // Supabase can return errors as query params and also as fragment in some cases.
  const error =
    url.searchParams.get("error") ?? new URLSearchParams(url.hash.replace(/^#/, "")).get("error");
  const errorCode =
    url.searchParams.get("error_code") ??
    new URLSearchParams(url.hash.replace(/^#/, "")).get("error_code");
  const errorDescription =
    url.searchParams.get("error_description") ??
    new URLSearchParams(url.hash.replace(/^#/, "")).get("error_description");

  if (error) {
    const redirect = new URL("/", req.url);
    redirect.searchParams.set("authError", error);
    if (errorCode) redirect.searchParams.set("authErrorCode", errorCode);
    if (errorDescription) redirect.searchParams.set("authErrorDescription", errorDescription);
    return NextResponse.redirect(redirect);
  }

  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type"); // e.g. "signup"

  const supabase = await createSupabaseServerClient();

  try {
    if (code) {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        console.error("[/auth/callback] exchangeCodeForSession error:", exchangeError);
        const redirect = new URL("/", req.url);
        redirect.searchParams.set("authError", "exchange_failed");
        return NextResponse.redirect(redirect);
      }
    } else if (tokenHash && type) {
      // Email confirmation links often come with token_hash + type=signup
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type as "signup" | "invite" | "magiclink" | "recovery" | "email_change",
      });
      if (verifyError) {
        console.error("[/auth/callback] verifyOtp error:", verifyError);
        const redirect = new URL("/", req.url);
        redirect.searchParams.set("authError", "otp_failed");
        return NextResponse.redirect(redirect);
      }
    }
  } finally {
    // We require explicit login after confirmation.
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }

  const redirect = new URL("/", req.url);
  redirect.searchParams.set("confirmed", "1");
  return NextResponse.redirect(redirect);
}

