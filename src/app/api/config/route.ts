import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DEFAULT_CONFIG, type AppConfig } from "@/lib/content/appConfig";

const CONFIG_ID = "default";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return NextResponse.json(DEFAULT_CONFIG);

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("app_config")
    .select("config")
    .eq("id", CONFIG_ID)
    .maybeSingle();

  if (error || !data?.config) return NextResponse.json(DEFAULT_CONFIG);
  return NextResponse.json({ ...DEFAULT_CONFIG, ...(data.config as AppConfig) });
}

export async function PUT(req: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "super_admin") {
    return new NextResponse("Forbidden", { status: 403 });
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

