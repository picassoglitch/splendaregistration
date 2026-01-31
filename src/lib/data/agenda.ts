import agenda from "@/data/agenda.json";
import type { AgendaItem, Track } from "@/lib/types";

export function getAgendaItems(): AgendaItem[] {
  return (agenda as AgendaItem[]).slice().sort((a, b) => {
    if (a.day !== b.day) return a.day.localeCompare(b.day);
    return a.startTime.localeCompare(b.startTime);
  });
}

export function getAgendaItem(id: string): AgendaItem | null {
  const key = decodeURIComponent(id).trim().toLowerCase();
  return getAgendaItems().find((x) => x.id.toLowerCase() === key) ?? null;
}

export const TRACKS: Track[] = ["Plenario", "Expositores", "Otros"];

