"use client";

import { useEffect, useState } from "react";

export type MeResponse = {
  user: { id: string; email?: string | null } | null;
  role: "user" | "admin" | "super_admin" | null;
};

export function useMe() {
  const [me, setMe] = useState<MeResponse>({ user: null, role: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await fetch("/api/me", { cache: "no-store" });
        const json = (await res.json()) as MeResponse;
        if (!cancelled) setMe(json);
      } catch {
        if (!cancelled) setMe({ user: null, role: null });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return { me, loading };
}

