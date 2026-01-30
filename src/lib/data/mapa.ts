import mapa from "@/data/mapa.json";
import type { MapPoint, MapPointType } from "@/lib/types";

export function getMapPoints(): MapPoint[] {
  return mapa as MapPoint[];
}

export const MAP_TYPES: { value: MapPointType; label: string }[] = [
  { value: "zona", label: "Zonas clave" },
  { value: "encuentro", label: "Punto de encuentro" },
  { value: "salon-break", label: "Salones / breaks" },
];

