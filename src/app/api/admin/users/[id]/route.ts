import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getRequesterRole, roleAtLeast, forbidden, unauthorized } from "@/lib/auth/requireRole";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PatchBody = {
  role?: "user" | "admin" | "super_admin";
  full_name?: string;
};

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params;
    const { role } = await getRequesterRole();
    if (!roleAtLeast(role, "super_admin")) return forbidden();

    const body = (await req.json()) as PatchBody;

    const updates: Record<string, unknown> = {};
    if (body.role) updates.role = body.role;
    if (typeof body.full_name === "string") updates.full_name = body.full_name;

    if (!Object.keys(updates).length) {
      return NextResponse.json({ error: "No updates." }, { status: 400 });
    }

    const svc = getSupabaseServiceClient();
    const { error } = await svc.from("profiles").update(updates).eq("id", id);
    if (error) {
      console.error("[/api/admin/users/:id] update error:", error);
      return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { headers: { "cache-control": "no-store" } });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHENTICATED") return unauthorized();
    console.error("[/api/admin/users/:id] unexpected:", e);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}

