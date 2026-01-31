import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getRequesterRole, roleAtLeast, forbidden, unauthorized } from "@/lib/auth/requireRole";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Track = "Plenario" | "Expositores" | "Otros";
type AgendaRow = {
  id: string;
  title: string;
  day: string;
  start_time: string;
  end_time: string;
  track: Track;
  location: string;
  description: string;
};

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params;
    const { role } = await getRequesterRole();
    if (!roleAtLeast(role, "admin")) return forbidden();

    const body = (await req.json()) as Partial<AgendaRow>;
    const svc = getSupabaseServiceClient();
    const { error } = await svc.from("agenda_items").update(body).eq("id", id);
    if (error) {
      console.error("[/api/admin/agenda/:id] update error:", error);
      return NextResponse.json({ error: "Failed to update." }, { status: 500 });
    }
    return NextResponse.json({ ok: true }, { headers: { "cache-control": "no-store" } });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHENTICATED") return unauthorized();
    console.error("[/api/admin/agenda/:id] unexpected:", e);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params;
    const { role } = await getRequesterRole();
    if (!roleAtLeast(role, "admin")) return forbidden();

    const svc = getSupabaseServiceClient();
    const { error } = await svc.from("agenda_items").delete().eq("id", id);
    if (error) {
      console.error("[/api/admin/agenda/:id] delete error:", error);
      return NextResponse.json({ error: "Failed to delete." }, { status: 500 });
    }
    return NextResponse.json({ ok: true }, { headers: { "cache-control": "no-store" } });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHENTICATED") return unauthorized();
    console.error("[/api/admin/agenda/:id] unexpected:", e);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}

