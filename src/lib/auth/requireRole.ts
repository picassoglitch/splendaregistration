import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AppRole = "user" | "admin" | "super_admin";

export async function getRequesterRole(): Promise<{
  userId: string;
  email: string | null;
  role: AppRole;
}> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("UNAUTHENTICATED");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw new Error("PROFILE_READ_FAILED");

  const role = (profile?.role ?? "user") as AppRole;
  return { userId: user.id, email: user.email ?? null, role };
}

export function roleAtLeast(role: AppRole, required: AppRole) {
  const rank: Record<AppRole, number> = { user: 0, admin: 1, super_admin: 2 };
  return rank[role] >= rank[required];
}

export function unauthorized() {
  return new NextResponse("Unauthorized", { status: 401 });
}

export function forbidden() {
  return new NextResponse("Forbidden", { status: 403 });
}

