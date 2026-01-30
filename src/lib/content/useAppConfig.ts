"use client";

import { useSyncExternalStore } from "react";
import { CONFIG_EVENT, DEFAULT_CONFIG, readConfig, type AppConfig } from "@/lib/content/appConfig";

// Must be referentially stable across calls to avoid React infinite-loop warnings.
const SERVER_SNAPSHOT: AppConfig = Object.freeze({ ...DEFAULT_CONFIG });
const getServerSnapshot = () => SERVER_SNAPSHOT;

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => undefined;
  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener(CONFIG_EVENT, handler as EventListener);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(CONFIG_EVENT, handler as EventListener);
  };
}

export function useAppConfig(): AppConfig {
  return useSyncExternalStore(subscribe, readConfig, getServerSnapshot);
}

