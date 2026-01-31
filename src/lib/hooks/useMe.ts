"use client";

import { useEffect, useState } from "react";

export type MeResponse = {
  user: { id: string; email?: string | null } | null;
  role: "user" | "admin" | "super_admin" | null;
};

export function useMe() {
  const [me, setMe] = useState<MeResponse>({ user: null, role: null });
  const [loading, setLoading] = useState(true);

  const fetchMe = async (signal?: AbortSignal) => {
    const res = await fetch("/api/me", { cache: "no-store", signal });
    const json = (await res.json()) as MeResponse;
    setMe(json);
  };

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const run = async () => {
      try {
        await fetchMe(controller.signal);
      } catch {
        if (!cancelled) setMe({ user: null, role: null });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return {
    me,
    loading,
    refetch: async () => {
      setLoading(true);
      try {
        await fetchMe();
      } finally {
        setLoading(false);
      }
    },
  };
}

