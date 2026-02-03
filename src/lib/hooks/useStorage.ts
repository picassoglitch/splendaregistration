"use client";

import { useSyncExternalStore } from "react";
import { FAV_KEY, STORAGE_EVENT } from "@/lib/storage";

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

const favCache: { raw: string | null | undefined; value: Set<string> } = {
  raw: undefined,
  value: new Set(),
};

export function useFavoritesSet() {
  return useSyncExternalStore(subscribe, getFavoritesSnapshot, () => new Set());
}

