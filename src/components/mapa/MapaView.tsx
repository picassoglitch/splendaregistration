"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { MapPoint, MapPointType } from "@/lib/types";
import { MAP_TYPES } from "@/lib/data/mapa";
import { useAppConfig } from "@/lib/content/useAppConfig";
import { EventLogo } from "@/components/branding/EventLogo";
import { cn } from "@/lib/cn";

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
    <div className="min-h-dvh text-white">
      <div className="px-6 pt-[max(26px,var(--sat))]">
        <div className="flex items-center justify-between">
          <Link href="/home" aria-label="Ir a inicio">
            <EventLogo
              logoUrl={cfg.logoUrl}
              size={46}
              frame={cfg.logoStyle !== "plain"}
              className={cfg.logoStyle !== "plain" ? "rounded-full shadow-[0_14px_36px_rgba(0,0,0,0.35)]" : ""}
            />
          </Link>
          <div className="flex-1 text-center">
            <div className="text-[34px] font-extrabold tracking-[0.08em]">
              {cfg.mapPageHeading || "MAPA"}
            </div>
          </div>
          <div className="w-[46px]" />
        </div>

        {/* Map placeholder card (like the mock white panel) */}
        <div className="mt-8 rounded-[26px] bg-white shadow-[0_22px_60px_rgba(0,0,0,0.25)]">
          <div className="aspect-[4/3] w-full rounded-[26px] bg-white" />
        </div>

        <div className="mt-8">
          <div className="text-[28px] font-extrabold tracking-tight">Descripción</div>
          <div className="mt-3 text-[13px] leading-5 text-white/90">
            {cfg.mapDescription}
          </div>
        </div>

        {/* Points list is hidden in this mocky layout; tapping filters can open dialogs */}
        <div className="mt-6 grid gap-3 pb-[110px]">
          {filtered.map((p) => (
            <button
              key={p.id}
              type="button"
              className="w-full rounded-2xl bg-white/10 px-4 py-3 text-left ring-1 ring-white/15"
              onClick={() => setOpenId(p.id)}
            >
              <div className="text-[15px] font-extrabold text-white">{p.title}</div>
              <div className="mt-1 line-clamp-2 text-[13px] font-semibold text-white/85">
                {p.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom type selector (circle controls like the mock) */}
      <div
        className="fixed left-1/2 z-20 w-full max-w-[480px] -translate-x-1/2"
        style={{ bottom: "max(14px, var(--sab))" }}
      >
        <div
          className="mx-auto w-[calc(100%-28px)] max-w-[440px] rounded-[26px] bg-[#173A73]/80 px-5 py-4 ring-1 ring-white/15 backdrop-blur-md"
          role="radiogroup"
          aria-label="Filtro de mapa"
        >
          <div className="flex w-full items-center justify-between gap-6">
            {MAP_TYPES.map((t) => {
              const active = t.value === filter;
              const label =
                t.value === "zona"
                  ? "Zonas"
                  : t.value === "encuentro"
                    ? "Punto"
                    : "Others";
              return (
                <button
                  key={t.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  className="flex flex-col items-center gap-2 outline-none focus-visible:ring-4 focus-visible:ring-white/25 rounded-2xl px-2 py-1"
                  onClick={() => setFilter(t.value)}
                >
                  <div
                    className={cn(
                      "h-11 w-11 rounded-full ring-2 ring-white",
                      active ? "bg-white/15" : "bg-transparent",
                    )}
                  >
                    <div
                      className={cn(
                        "mx-auto mt-[9px] h-5 w-5 rounded-full",
                        active ? "bg-white" : "bg-transparent",
                      )}
                    />
                  </div>
                  <div
                    className={cn(
                      "text-[14px] font-extrabold",
                      active ? "text-white" : "text-white/90",
                    )}
                  >
                    {label}
                  </div>
                </button>
              );
            })}
          </div>
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

