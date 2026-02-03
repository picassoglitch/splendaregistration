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

