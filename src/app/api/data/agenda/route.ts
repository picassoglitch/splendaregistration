import { NextResponse } from "next/server";
import type { AgendaItem } from "@/lib/types";
import { readLocalAgendaOverride, writeLocalAgendaOverride, clearLocalAgendaOverride } from "@/lib/server/localDataStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function isAgendaItem(x: any): x is AgendaItem {
  return (
    x &&
    typeof x === "object" &&
    typeof x.id === "string" &&
    typeof x.title === "string" &&
    typeof x.day === "string" &&
    typeof x.startTime === "string" &&
    typeof x.endTime === "string" &&
    typeof x.location === "string" &&
    typeof x.track === "string" &&
    typeof x.description === "string"
  );
}

export async function GET() {
  const items = await readLocalAgendaOverride();
  return NextResponse.json({ items }, { headers: { "cache-control": "no-store" } });
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as { items?: unknown };
    const items = body.items;
    if (!Array.isArray(items) || !items.every(isAgendaItem)) {
      return new NextResponse("Invalid agenda items", { status: 400 });
    }
    await writeLocalAgendaOverride(items);
    return NextResponse.json({ ok: true }, { headers: { "cache-control": "no-store" } });
  } catch {
    return new NextResponse("Bad Request", { status: 400 });
  }
}

export async function DELETE() {
  await clearLocalAgendaOverride();
  return NextResponse.json({ ok: true }, { headers: { "cache-control": "no-store" } });
}

