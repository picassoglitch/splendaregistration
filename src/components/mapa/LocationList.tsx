"use client";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { MapLocation } from "@/components/mapa/InteractiveMap";

export function LocationList({
  title,
  locations,
  selectedId,
  onSelect,
  compact,
}: {
  title: string;
  locations: MapLocation[];
  selectedId: string | null;
  onSelect: (key: string) => void;
  compact?: boolean;
}) {
  return (
    <Card className={cn("p-4", compact ? "shadow-none border-0 bg-transparent p-0" : null)}>
      {title ? (
        <div className="text-[14px] font-extrabold text-zinc-900">{title}</div>
      ) : null}

      <div className={cn("mt-3 grid gap-2", compact ? "mt-1" : null)}>
        {locations.length ? (
          locations.map((loc) => {
            const active = selectedId === loc.key;
            return (
              <button
                key={loc.key}
                type="button"
                onClick={() => onSelect(loc.key)}
                className={cn(
                  "w-full rounded-2xl px-3 py-3 text-left ring-1 transition",
                  active
                    ? "bg-[#173A73] text-white ring-[#173A73]"
                    : "bg-white text-zinc-900 ring-border hover:bg-zinc-50 active:bg-zinc-100",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className={cn("text-[14px] font-extrabold", active ? "text-white" : "text-zinc-900")}>
                    {loc.id}. {loc.name}
                  </div>
                </div>
                <div className={cn("mt-1 text-[12px] font-semibold", active ? "text-white/85" : "text-zinc-600")}>
                  {loc.category === "areas_comunes"
                    ? "Áreas comunes"
                    : loc.category === "habitaciones"
                      ? "Habitaciones"
                      : "Restaurantes"}
                </div>
              </button>
            );
          })
        ) : (
          <div className="rounded-2xl bg-white px-3 py-3 text-[13px] font-semibold text-zinc-600 ring-1 ring-border">
            Sin resultados.
          </div>
        )}
      </div>
    </Card>
  );
}

