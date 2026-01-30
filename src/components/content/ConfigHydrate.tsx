"use client";

import { useEffect } from "react";
import { writeConfig } from "@/lib/content/appConfig";

export function ConfigHydrate() {
  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/config", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (json && typeof json === "object") writeConfig(json);
      } catch {
        // ignore (offline, etc.)
      }
    };
    run();
  }, []);

  return null;
}

