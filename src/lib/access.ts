"use client";

export type AppAccess = "user" | "admin";

const ACCESS_KEY = "ss2026.access";

export function getAccess(): AppAccess | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ACCESS_KEY);
    if (raw === "user" || raw === "admin") return raw;
    return null;
  } catch {
    return null;
  }
}

export function setAccess(access: AppAccess) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_KEY, access);
}

export function clearAccess() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_KEY);
}

