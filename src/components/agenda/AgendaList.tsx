"use client";

import { useMemo, useState } from "react";
import type { AgendaItem, Track } from "@/lib/types";
import { Tabs } from "@/components/ui/Tabs";
import { AgendaItemRow } from "@/components/agenda/AgendaItemRow";
import { Card } from "@/components/ui/Card";
import { useFavoritesSet } from "@/lib/hooks/useStorage";

type Filter = Track;

export function AgendaList({ items }: { items: AgendaItem[] }) {
  const [filter, setFilter] = useState<Filter>("Plenario");
  const favorites = useFavoritesSet();

  const filtered = useMemo(() => {
    return items.filter((x) => x.track === filter);
  }, [filter, items]);

  return (
    <div className="pb-[56px]">
      <Card className="overflow-hidden">
        <div className="grid grid-cols-[68px_1fr_72px] gap-3 border-b border-border bg-white px-4 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">
          <div>Día / Hora</div>
          <div>Evento</div>
          <div className="text-right">Salón</div>
        </div>
        <div className="divide-y divide-border">
          {filtered.map((item) => (
            <AgendaItemRow
              key={item.id}
              item={item}
              isFavorite={favorites.has(item.id)}
            />
          ))}
        </div>
      </Card>

      {/* Bottom filter bar (wireframe-style) */}
      <div
        className="fixed inset-x-0 z-20 w-full px-[max(14px,var(--sal))] pr-[max(14px,var(--sar))] md:left-1/2 md:max-w-[430px] md:-translate-x-1/2"
        style={{ bottom: "calc(72px + max(10px, var(--sab)))" }}
      >
        <div className="px-2 pb-2">
          <Tabs
            value={filter}
            onChange={setFilter}
            options={[
              { value: "Plenario", label: "Plenario" },
              { value: "Expositores", label: "Expositores" },
              { value: "Otros", label: "Otros" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

