import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DEFAULT_CONFIG, type AppConfig } from "@/lib/content/appConfig";

const CONFIG_ID = "default";

function adminAllowed(email?: string | null) {
  const allow = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (!allow.length) return false;
  return email ? allow.includes(email.toLowerCase()) : false;
}

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return NextResponse.json(DEFAULT_CONFIG);

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("app_config")
    .select("config")
    .eq("id", CONFIG_ID)
    .maybeSingle();

  if (error || !data?.config) return NextResponse.json(DEFAULT_CONFIG);
  return NextResponse.json({ ...DEFAULT_CONFIG, ...(data.config as AppConfig) });
}

export async function PUT(req: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !adminAllowed(user.email)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = (await req.json()) as Partial<AppConfig>;
  const next: AppConfig = { ...DEFAULT_CONFIG, ...body } as AppConfig;

  const { error } = await supabase.from("app_config").upsert({
    id: CONFIG_ID,
    config: next,
  });

  if (error) return new NextResponse("Failed", { status: 500 });
  return NextResponse.json(next);
}

