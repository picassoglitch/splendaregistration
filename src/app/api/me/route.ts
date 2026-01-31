import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("[/api/me] auth.getUser error:", userError);
    }

    if (!user) {
      return NextResponse.json(
        { user: null, profileMissing: null },
        { headers: { "cache-control": "no-store" } },
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id,email,full_name,role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("[/api/me] profiles select error:", profileError);
      return NextResponse.json(
        {
          error: "Failed to load profile.",
          errorCode: profileError.code ?? null,
          // Safe debugging (no secrets). Helps identify RLS/privilege issues quickly.
          errorHint: profileError.message ?? null,
        },
        { status: 500, headers: { "cache-control": "no-store" } },
      );
    }

    if (!profile) {
      const fullName =
        (user.user_metadata?.full_name as string | undefined) ??
        (user.user_metadata?.name as string | undefined) ??
        null;
      return NextResponse.json(
        {
          user: {
            id: user.id,
            email: user.email,
            full_name: fullName,
            role: null,
          },
          profileMissing: true,
        },
        { headers: { "cache-control": "no-store" } },
      );
    }

    return NextResponse.json(
      {
        user: {
          id: profile.id,
          email: profile.email ?? user.email,
          full_name: profile.full_name ?? null,
          role: profile.role ?? null,
        },
        profileMissing: false,
      },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (err) {
    console.error("[/api/me] unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500, headers: { "cache-control": "no-store" } },
    );
  }
}

