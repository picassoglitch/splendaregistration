import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { readAccessFromCookies } from "@/lib/server/accessCookie";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function sanitizePath(p: string) {
  const path = p.replaceAll("\\", "/").replace(/^\/+/, "");
  if (!path || path.includes("..")) return null;
  if (!/^[a-zA-Z0-9/_\-.]+$/.test(path)) return null;
  return path;
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const access = readAccessFromCookies(cookieStore);
  if (access !== "admin") return new NextResponse("Forbidden", { status: 403 });

  const form = await req.formData();
  const file = form.get("file");
  const rawPath = String(form.get("path") ?? "");
  const bucket = String(form.get("bucket") ?? "assets");
  const upsert = String(form.get("upsert") ?? "1") === "1";

  if (!(file instanceof File)) return new NextResponse("Missing file", { status: 400 });
  const path = sanitizePath(rawPath);
  if (!path) return new NextResponse("Invalid path", { status: 400 });

  const supabase = getSupabaseServiceClient();
  const arrayBuffer = await file.arrayBuffer();
  const contentType = file.type || "application/octet-stream";

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, new Uint8Array(arrayBuffer), {
      upsert,
      contentType,
      cacheControl: "3600",
    });

  if (error) {
    console.error("[upload] storage upload error:", error);
    return new NextResponse("Upload failed", { status: 500 });
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return NextResponse.json({ ok: true, path, publicUrl: data.publicUrl }, { headers: { "cache-control": "no-store" } });
}

