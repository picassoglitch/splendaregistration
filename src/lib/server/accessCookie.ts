import crypto from "node:crypto";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export type AccessLevel = "user" | "admin";

const COOKIE_NAME = "ss2026_access";

function secret() {
  const s = process.env.APP_COOKIE_SECRET;
  if (!s) throw new Error("Missing APP_COOKIE_SECRET");
  return s;
}

function sign(payload: string) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function makeAccessCookieValue(access: AccessLevel, maxAgeSeconds: number) {
  const exp = Math.floor(Date.now() / 1000) + maxAgeSeconds;
  const payload = `${access}.${exp}`;
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

export function readAccessFromCookies(cookies: ReadonlyRequestCookies): AccessLevel | null {
  const raw = cookies.get(COOKIE_NAME)?.value ?? "";
  const [access, expStr, sig] = raw.split(".");
  if (access !== "user" && access !== "admin") return null;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp <= Math.floor(Date.now() / 1000)) return null;
  const payload = `${access}.${exp}`;
  if (!sig || sign(payload) !== sig) return null;
  return access;
}

export const ACCESS_COOKIE_NAME = COOKIE_NAME;

