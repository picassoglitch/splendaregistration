import { NextResponse } from "next/server";
import { ACCESS_COOKIE_NAME, makeAccessCookieValue, type AccessLevel } from "@/lib/server/accessCookie";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function passes() {
  const user = process.env.APP_USER_PASS ?? "sweetandsmart2026";
  const admin = process.env.APP_ADMIN_PASS ?? "seewtandsmartadmin2026";
  const adminAlt = process.env.APP_ADMIN_PASS_ALT ?? "sweetandsmartadmin2026";
  return { user, admin, adminAlt };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { password?: string };
    const password = String(body.password ?? "").trim();
    const { user, admin, adminAlt } = passes();

    let access: AccessLevel | null = null;
    if (password === user) access = "user";
    if (password === admin || password === adminAlt) access = "admin";
    if (!access) return NextResponse.json({ ok: false }, { status: 401 });

    const res = NextResponse.json({ ok: true, access }, { headers: { "cache-control": "no-store" } });
    const value = makeAccessCookieValue(access, 60 * 60 * 24 * 30); // 30 days
    res.cookies.set({
      name: ACCESS_COOKIE_NAME,
      value,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch {
    return new NextResponse("Bad Request", { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true }, { headers: { "cache-control": "no-store" } });
  res.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}

