"use client";

import { useEffect, useMemo, useState } from "react";
import type { MapPoint } from "@/lib/types";
import { getMapPoints } from "@/lib/data/mapa";
import { MapaView } from "@/components/mapa/MapaView";
import { DATA_EVENT, fetchMapOverride } from "@/lib/data/overrides";

export function MapaClient() {
  const [override, setOverride] = useState<MapPoint[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      const next = await fetchMapOverride();
      if (!cancelled) setOverride(next);
    };
    const onEvent = () => {
      refresh().catch(() => undefined);
    };
    refresh().catch(() => undefined);
    const t = window.setInterval(() => refresh().catch(() => undefined), 2000);
    window.addEventListener(DATA_EVENT, onEvent as EventListener);
    return () => {
      cancelled = true;
      window.clearInterval(t);
      window.removeEventListener(DATA_EVENT, onEvent as EventListener);
    };
  }, []);

  const points = useMemo(() => override ?? getMapPoints(), [override]);

  return <MapaView points={points} />;
}

