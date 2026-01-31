import { NextResponse } from "next/server";
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

export async function GET() {
  try {
    const { role } = await getRequesterRole();
    if (!roleAtLeast(role, "admin")) return forbidden();

    const svc = getSupabaseServiceClient();
    const { data, error } = await svc
      .from("agenda_items")
      .select("id,title,day,start_time,end_time,track,location,description")
      .order("day", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) {
      console.error("[/api/admin/agenda] select error:", error);
      return NextResponse.json({ error: "Failed to load agenda." }, { status: 500 });
    }

    return NextResponse.json({ items: data ?? [] }, { headers: { "cache-control": "no-store" } });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHENTICATED") return unauthorized();
    console.error("[/api/admin/agenda] unexpected:", e);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { role } = await getRequesterRole();
    if (!roleAtLeast(role, "admin")) return forbidden();

    const body = (await req.json()) as AgendaRow;
    const svc = getSupabaseServiceClient();
    const { error } = await svc.from("agenda_items").insert(body);
    if (error) {
      console.error("[/api/admin/agenda] insert error:", error);
      return NextResponse.json({ error: "Failed to create." }, { status: 500 });
    }
    return NextResponse.json({ ok: true }, { headers: { "cache-control": "no-store" } });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHENTICATED") return unauthorized();
    console.error("[/api/admin/agenda] unexpected:", e);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}

