import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminClient } from "@/app/admin/ui/AdminClient";

function adminAllowed(email?: string | null) {
  const allow = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (!allow.length) return false;
  return email ? allow.includes(email.toLowerCase()) : false;
}

export default async function AdminPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) redirect("/");

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");
  if (!adminAllowed(user.email)) redirect("/home");

  return <AdminClient />;
}

