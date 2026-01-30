"use client";

import { useSyncExternalStore } from "react";
import {
  FAV_KEY,
  PROFILE_KEY,
  STORAGE_EVENT,
  type StoredProfile,
} from "@/lib/storage";

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => undefined;

  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener(STORAGE_EVENT, handler as EventListener);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(STORAGE_EVENT, handler as EventListener);
  };
}

function getProfileSnapshot(): StoredProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw === profileCache.raw) return profileCache.value;
    if (!raw) {
      profileCache.raw = raw;
      profileCache.value = null;
      return null;
    }
    profileCache.raw = raw;
    profileCache.value = JSON.parse(raw) as StoredProfile;
    return profileCache.value;
  } catch {
    profileCache.raw = null;
    profileCache.value = null;
    return null;
  }
}

function getFavoritesSnapshot(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(FAV_KEY);
    if (raw === favCache.raw) return favCache.value;
    if (!raw) {
      favCache.raw = raw;
      favCache.value = new Set();
      return favCache.value;
    }
    const ids = JSON.parse(raw) as string[];
    favCache.raw = raw;
    favCache.value = new Set(ids);
    return favCache.value;
  } catch {
    favCache.raw = null;
    favCache.value = new Set();
    return favCache.value;
  }
}

const profileCache: { raw: string | null | undefined; value: StoredProfile | null } = {
  raw: undefined,
  value: null,
};

const favCache: { raw: string | null | undefined; value: Set<string> } = {
  raw: undefined,
  value: new Set(),
};

export function useStoredProfile() {
  return useSyncExternalStore(subscribe, getProfileSnapshot, () => null);
}

export function useFavoritesSet() {
  return useSyncExternalStore(subscribe, getFavoritesSnapshot, () => new Set());
}

