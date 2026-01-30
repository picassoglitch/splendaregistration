export type StoredProfile = {
  name: string;
  email: string;
  company?: string;
  role?: string;
};

export const STORAGE_EVENT = "ss2026-storage";
export const PROFILE_KEY = "ss2026.profile";
export const FAV_KEY = "ss2026.favorites";

export function notifyStorageChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function getStoredProfile(): StoredProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredProfile;
  } catch {
    return null;
  }
}

export function setStoredProfile(profile: StoredProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  notifyStorageChange();
}

export function clearStoredProfile() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROFILE_KEY);
  notifyStorageChange();
}

export function getFavorites(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(FAV_KEY);
    if (!raw) return new Set();
    const ids = JSON.parse(raw) as string[];
    return new Set(ids);
  } catch {
    return new Set();
  }
}

export function setFavorites(ids: Set<string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAV_KEY, JSON.stringify(Array.from(ids)));
  notifyStorageChange();
}

