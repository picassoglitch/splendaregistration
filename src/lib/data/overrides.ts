"use client";

import type { AgendaItem, MapPoint } from "@/lib/types";

export const DATA_EVENT = "ss2026-data";

function notify() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(DATA_EVENT));
}

export async function fetchAgendaOverride(): Promise<AgendaItem[] | null> {
  try {
    const res = await fetch("/api/data/agenda", { cache: "no-store" });
    if (!res.ok) return null;
    const json = (await res.json()) as { items?: AgendaItem[] | null };
    return Array.isArray(json.items) ? json.items : null;
  } catch {
    return null;
  }
}

export async function saveAgendaOverride(items: AgendaItem[]) {
  await fetch("/api/data/agenda", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ items }),
  });
  notify();
}

export async function clearAgendaOverride() {
  await fetch("/api/data/agenda", { method: "DELETE" });
  notify();
}

export async function fetchMapOverride(): Promise<MapPoint[] | null> {
  try {
    const res = await fetch("/api/data/mapa", { cache: "no-store" });
    if (!res.ok) return null;
    const json = (await res.json()) as { points?: MapPoint[] | null };
    return Array.isArray(json.points) ? json.points : null;
  } catch {
    return null;
  }
}

export async function saveMapOverride(points: MapPoint[]) {
  await fetch("/api/data/mapa", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ points }),
  });
  notify();
}

export async function clearMapOverride() {
  await fetch("/api/data/mapa", { method: "DELETE" });
  notify();
}

