"use client";

import { useEffect } from "react";
import { readConfig, writeConfig } from "@/lib/content/appConfig";

export function ConfigHydrate() {
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const res = await fetch("/api/config", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (cancelled) return;
        if (json && typeof json === "object") {
          const current = readConfig();
          // Only write if something actually changed (avoids extra renders)
          if (JSON.stringify(current) !== JSON.stringify(json)) {
            writeConfig(json);
          }
        }
      } catch {
        // ignore (offline, etc.)
      }
    };
    run();
    // Poll so changes from Admin reflect in other browser contexts (including Incognito)
    const t = window.setInterval(run, 2000);
    return () => {
      cancelled = true;
      window.clearInterval(t);
    };
  }, []);

  return null;
}

