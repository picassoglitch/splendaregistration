import { NextResponse } from "next/server";
import { getRequesterRole, roleAtLeast, forbidden, unauthorized } from "@/lib/auth/requireRole";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type UserRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export async function GET(req: Request) {
  try {
    const { role } = await getRequesterRole();
    if (!roleAtLeast(role, "admin")) return forbidden();

    const svc = getSupabaseServiceClient();
    const { data, error } = await svc
      .from("profiles")
      .select("id,email,full_name,role,created_at,updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[/api/admin/users] select error:", error);
      return NextResponse.json({ error: "Failed to load users." }, { status: 500 });
    }

    const url = new URL(req.url);
    const format = url.searchParams.get("format");
    if (format === "csv") {
      const header = "id,email,full_name,role,created_at,updated_at";
      const rows = ((data ?? []) as UserRow[]).map((u) =>
        [
          u.id,
          u.email ?? "",
          (u.full_name ?? "").replaceAll("\"", "\"\""),
          u.role ?? "",
          u.created_at ?? "",
          u.updated_at ?? "",
        ]
          .map((v) => `"${String(v)}"`)
          .join(","),
      );
      const csv = [header, ...rows].join("\n");
      return new NextResponse(csv, {
        headers: {
          "content-type": "text/csv; charset=utf-8",
          "cache-control": "no-store",
          "content-disposition": "attachment; filename=\"users.csv\"",
        },
      });
    }

    return NextResponse.json({ users: (data ?? []) as UserRow[] }, { headers: { "cache-control": "no-store" } });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHENTICATED") return unauthorized();
    console.error("[/api/admin/users] unexpected:", e);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}

