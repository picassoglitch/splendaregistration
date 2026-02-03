import { NextResponse } from "next/server";
import { DEFAULT_CONFIG, type AppConfig } from "@/lib/content/appConfig";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { cookies } from "next/headers";
import { readAccessFromCookies } from "@/lib/server/accessCookie";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && anon && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = getSupabaseServiceClient();
    const { data } = await supabase
      .from("app_config")
      .select("config")
      .eq("id", "default")
      .maybeSingle();
    const config = (data?.config as Partial<AppConfig> | null) ?? null;
    const cfg = { ...DEFAULT_CONFIG, ...(config ?? {}) } as AppConfig;
    return NextResponse.json(cfg, { headers: { "cache-control": "no-store" } });
  }

  // If Supabase env isn't configured, just return defaults.
  return NextResponse.json(DEFAULT_CONFIG, { headers: { "cache-control": "no-store" } });
}

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const access = readAccessFromCookies(cookieStore);
    if (access !== "admin") return new NextResponse("Forbidden", { status: 403 });

    const body = (await req.json()) as Partial<AppConfig>;
    const next: AppConfig = { ...DEFAULT_CONFIG, ...body } as AppConfig;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && anon && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = getSupabaseServiceClient();
      const { error } = await supabase.from("app_config").upsert({
        id: "default",
        config: next,
      });
      if (error) return new NextResponse("Failed", { status: 500 });
      return NextResponse.json(next, { headers: { "cache-control": "no-store" } });
    }

    return new NextResponse("Supabase not configured", { status: 500 });
  } catch {
    return new NextResponse("Bad Request", { status: 400 });
  }
}

