import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _svc: SupabaseClient | null = null;

export function getSupabaseServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY (set it in Vercel env vars; never expose in NEXT_PUBLIC_*)",
    );
  }
  if (_svc) return _svc;
  _svc = createClient(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _svc;
}

