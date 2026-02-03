import { NextResponse } from "next/server";
import type { MapPoint } from "@/lib/types";
import { readLocalMapOverride, writeLocalMapOverride, clearLocalMapOverride } from "@/lib/server/localDataStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function isMapPoint(x: any): x is MapPoint {
  return (
    x &&
    typeof x === "object" &&
    typeof x.id === "string" &&
    typeof x.type === "string" &&
    typeof x.title === "string" &&
    typeof x.description === "string"
  );
}

export async function GET() {
  const points = await readLocalMapOverride();
  return NextResponse.json({ points }, { headers: { "cache-control": "no-store" } });
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as { points?: unknown };
    const points = body.points;
    if (!Array.isArray(points) || !points.every(isMapPoint)) {
      return new NextResponse("Invalid map points", { status: 400 });
    }
    await writeLocalMapOverride(points);
    return NextResponse.json({ ok: true }, { headers: { "cache-control": "no-store" } });
  } catch {
    return new NextResponse("Bad Request", { status: 400 });
  }
}

export async function DELETE() {
  await clearLocalMapOverride();
  return NextResponse.json({ ok: true }, { headers: { "cache-control": "no-store" } });
}

