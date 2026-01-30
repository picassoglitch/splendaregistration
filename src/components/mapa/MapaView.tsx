"use client";

import { useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Map, X } from "lucide-react";
import type { MapPoint, MapPointType } from "@/lib/types";
import { MAP_TYPES } from "@/lib/data/mapa";
import { Tabs } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";
import { useAppConfig } from "@/lib/content/useAppConfig";

type Filter = MapPointType;

export function MapaView({ points }: { points: MapPoint[] }) {
  const [filter, setFilter] = useState<Filter>("zona");
  const [openId, setOpenId] = useState<string | null>(null);
  const cfg = useAppConfig();

  const filtered = useMemo(
    () => points.filter((p) => p.type === filter),
    [points, filter],
  );

  const selected = useMemo(
    () => points.find((p) => p.id === openId) ?? null,
    [points, openId],
  );

  return (
    <div className="pb-[56px]">
      <Card className="overflow-hidden">
        <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-brand-600/20 via-white to-brand-600/10">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-3 text-zinc-900 shadow-sm ring-1 ring-border backdrop-blur">
              <Map className="h-5 w-5 text-brand-700" />
              <div className="text-[14px] font-extrabold">Mapa del recinto</div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-zinc-500">
            Descripción
          </div>
          <div className="mt-2 rounded-2xl border border-border bg-white px-4 py-3 text-[13px] font-semibold text-zinc-600 shadow-sm">
            {cfg.mapDescription}
          </div>
        </div>
      </Card>

      <div className="mt-4 grid gap-3">
        {filtered.map((p) => (
          <button
            key={p.id}
            type="button"
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-left shadow-sm transition hover:bg-zinc-50 active:bg-zinc-100"
            onClick={() => setOpenId(p.id)}
          >
            <div className="text-[15px] font-extrabold text-zinc-900">
              {p.title}
            </div>
            <div className="mt-1 line-clamp-2 text-[13px] font-semibold text-zinc-600">
              {p.description}
            </div>
          </button>
        ))}
      </div>

      {/* Bottom filter bar (wireframe-style) */}
      <div
        className="fixed left-1/2 z-20 w-full max-w-[480px] -translate-x-1/2 px-[max(14px,var(--sal))] pr-[max(14px,var(--sar))]"
        style={{ bottom: "calc(72px + max(10px, var(--sab)))" }}
      >
        <div className="px-2 pb-2">
          <Tabs
            value={filter}
            onChange={setFilter}
            options={MAP_TYPES.map((t) => ({ value: t.value, label: t.label }))}
          />
        </div>
      </div>

      <Dialog.Root open={Boolean(openId)} onOpenChange={(o) => !o && setOpenId(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-28px)] max-w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-black/10">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Dialog.Title className="text-[16px] font-extrabold text-zinc-900">
                  {selected?.title ?? "Detalle"}
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-[13px] font-semibold text-zinc-600">
                  {selected?.description ?? ""}
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Cerrar"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl hover:bg-zinc-900/5 active:bg-zinc-900/10"
                >
                  <X className="h-5 w-5 text-zinc-900" />
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

