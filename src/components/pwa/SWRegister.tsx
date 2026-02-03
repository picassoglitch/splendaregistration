"use client";

import { useEffect } from "react";

export function SWRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const register = async () => {
      try {
        // In local dev, aggressively disable SW to avoid stale HTML and hydration mismatches.
        if (process.env.NODE_ENV === "development") {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));
          if ("caches" in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map((k) => caches.delete(k)));
          }
          return;
        }
        await navigator.serviceWorker.register("/sw.js");
      } catch {
        // ignore
      }
    };
    register();
  }, []);

  return null;
}

