import { NextResponse } from "next/server";
import { DEFAULT_CONFIG, type AppConfig } from "@/lib/content/appConfig";
import { readLocalConfig, writeLocalConfig } from "@/lib/server/localConfigStore";

export async function GET() {
  const cfg = await readLocalConfig();
  return NextResponse.json(cfg, { headers: { "cache-control": "no-store" } });
}

// Local-only persistence so Admin changes reflect across all browser contexts (including Incognito).
export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as Partial<AppConfig>;
    const next: AppConfig = { ...DEFAULT_CONFIG, ...body } as AppConfig;
    await writeLocalConfig(next);
    return NextResponse.json(next, { headers: { "cache-control": "no-store" } });
  } catch {
    return new NextResponse("Bad Request", { status: 400 });
  }
}

