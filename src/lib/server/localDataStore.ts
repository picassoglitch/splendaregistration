import { promises as fs } from "node:fs";
import path from "node:path";
import type { AgendaItem, MapPoint } from "@/lib/types";

const DIR = path.join(process.cwd(), ".local");
const AGENDA_FILE = path.join(DIR, "agenda_override.json");
const MAPA_FILE = path.join(DIR, "mapa_override.json");

export async function readLocalAgendaOverride(): Promise<AgendaItem[] | null> {
  try {
    const raw = await fs.readFile(AGENDA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AgendaItem[]) : null;
  } catch {
    return null;
  }
}

export async function writeLocalAgendaOverride(items: AgendaItem[]): Promise<void> {
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(AGENDA_FILE, JSON.stringify(items, null, 2), "utf8");
}

export async function clearLocalAgendaOverride(): Promise<void> {
  try {
    await fs.unlink(AGENDA_FILE);
  } catch {
    // ignore
  }
}

export async function readLocalMapOverride(): Promise<MapPoint[] | null> {
  try {
    const raw = await fs.readFile(MAPA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as MapPoint[]) : null;
  } catch {
    return null;
  }
}

export async function writeLocalMapOverride(points: MapPoint[]): Promise<void> {
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(MAPA_FILE, JSON.stringify(points, null, 2), "utf8");
}

export async function clearLocalMapOverride(): Promise<void> {
  try {
    await fs.unlink(MAPA_FILE);
  } catch {
    // ignore
  }
}

