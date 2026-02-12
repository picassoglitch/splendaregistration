import { NextResponse } from "next/server";
import { ACCESS_COOKIE_NAME, makeAccessCookieValue, type AccessLevel } from "@/lib/server/accessCookie";
import { cookies } from "next/headers";
import { readAccessFromCookies } from "@/lib/server/accessCookie";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Simple in-memory rate limiter: max 5 failed attempts per IP, locked for 5 minutes
const failedAttempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_MS = 5 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const entry = failedAttempts.get(ip);
  if (!entry) return false;
  if (Date.now() > entry.lockedUntil) {
    failedAttempts.delete(ip);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailure(ip: string) {
  const entry = failedAttempts.get(ip) ?? { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = Date.now() + LOCK_MS;
  }
  failedAttempts.set(ip, entry);
}

function clearFailures(ip: string) {
  failedAttempts.delete(ip);
}

function passes() {
  const user = process.env.APP_USER_PASS ?? "splenda";
  const admin = process.env.APP_ADMIN_PASS ?? "seewtandsmartadmin2026";
  const adminAlt = process.env.APP_ADMIN_PASS_ALT ?? "sweetandsmartadmin2026";
  return { user, admin, adminAlt };
}

export async function GET() {
  const cookieStore = await cookies();
  const access = readAccessFromCookies(cookieStore);
  return NextResponse.json(
    { ok: true, access },
    { headers: { "cache-control": "no-store" } },
  );
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "Demasiados intentos. Intenta de nuevo en 5 minutos." },
        { status: 429 },
      );
    }

    const body = (await req.json()) as { password?: string };
    const password = String(body.password ?? "").trim();
    const { user, admin, adminAlt } = passes();

    let access: AccessLevel | null = null;
    if (password === user) access = "user";
    if (password === admin || password === adminAlt) access = "admin";
    if (!access) {
      recordFailure(ip);
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    clearFailures(ip);

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

