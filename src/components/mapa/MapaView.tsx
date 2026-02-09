"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { List, Search, X } from "lucide-react";
import type { MapPoint } from "@/lib/types";
import { useAppConfig } from "@/lib/content/useAppConfig";
import { EventLogo } from "@/components/branding/EventLogo";
import { cn } from "@/lib/cn";
import { InteractiveMap } from "@/components/mapa/InteractiveMap";
import { LocationList } from "@/components/mapa/LocationList";
import { MapBottomSheet } from "@/components/mapa/MapBottomSheet";

type LocationCategory = "areas_comunes" | "habitaciones" | "restaurantes";
type LocationFilter = "todos" | LocationCategory;

// Local bundled asset (exported from the PDF as a high-res PNG).
// Put the file at: `public/event-map.png`
//
// BasePath-safe for Vercel/Next.js `basePath` deployments.
// In the App Router we don't have `next/router` basePath, so we use the runtime global
// that Next.js sets internally.
const BASE_PATH =
  typeof window !== "undefined" && (window as any).__NEXT_ROUTER_BASEPATH
    ? String((window as any).__NEXT_ROUTER_BASEPATH)
    : "";
const MAP_IMAGE_SRC = `${BASE_PATH}/event-map.png`;

// Data-driven pin overlay using normalized coordinates (0..1 relative to the image).
// TODO: Fine-tune x/y by comparing to the PNG in `/public/event-map.png`.
// TODO: Add the rest of the numbered points from the map.
export const MAP_LOCATIONS: {
  id: number;
  name: string;
  category: LocationCategory;
  x: number;
  y: number;
  description?: string;
}[] = [
  { id: 1, name: "Estacionamiento", category: "areas_comunes", x: 0.82, y: 0.48, description: "Descripción pendiente" },
  { id: 3, name: "Recepción", category: "areas_comunes", x: 0.77, y: 0.50, description: "Descripción pendiente" },
  { id: 9, name: "Soles", category: "areas_comunes", x: 0.28, y: 0.53, description: "Descripción pendiente" },
  { id: 16, name: "Cactus", category: "habitaciones", x: 0.62, y: 0.58, description: "Descripción pendiente" },
  { id: 19, name: "Fresnos", category: "habitaciones", x: 0.46, y: 0.34, description: "Descripción pendiente" },
  { id: 26, name: "Naranjos", category: "restaurantes", x: 0.74, y: 0.42, description: "Descripción pendiente" },
];

const FILTERS: { key: LocationFilter; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "areas_comunes", label: "Áreas comunes" },
  { key: "habitaciones", label: "Habitaciones" },
  { key: "restaurantes", label: "Restaurantes" },
];

function labelForCategory(cat: LocationCategory) {
  if (cat === "areas_comunes") return "Áreas comunes";
  if (cat === "habitaciones") return "Habitaciones";
  return "Restaurantes";
}

export function MapaView({ points }: { points: MapPoint[] }) {
  // NOTE: `points` is kept for backward compatibility, but this screen now uses MAP_LOCATIONS.
  void points;

  const [filter, setFilter] = useState<LocationFilter>("todos");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const cfg = useAppConfig();
  const mapApiRef = useRef<{ centerOn: (x: number, y: number) => void } | null>(null);

  const selected = useMemo(
    () => MAP_LOCATIONS.find((x) => x.id === selectedId) ?? null,
    [selectedId],
  );

  const filteredLocations = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MAP_LOCATIONS.filter((loc) => {
      const okCat = filter === "todos" ? true : loc.category === filter;
      const okQuery = !q ? true : loc.name.toLowerCase().includes(q) || String(loc.id).includes(q);
      return okCat && okQuery;
    });
  }, [filter, query]);

  const onPickLocation = (id: number) => {
    setSelectedId(id);
    const loc = MAP_LOCATIONS.find((x) => x.id === id);
    if (loc) mapApiRef.current?.centerOn(loc.x, loc.y);
  };

  const title = selected ? `${selected.id}. ${selected.name}` : "Detalle";

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

        {/* Filters + Search */}
        <div className="mt-6 space-y-3">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const active = f.key === filter;
              return (
                <button
                  key={f.key}
                  type="button"
                  className={cn(
                    "h-10 rounded-2xl px-4 text-[13px] font-extrabold ring-1 transition",
                    active
                      ? "bg-white text-[#173A73] ring-white/20 shadow-sm"
                      : "bg-white/10 text-white ring-white/15 hover:bg-white/15 active:bg-white/20",
                  )}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/70" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar lugar…"
              className={cn(
                "h-12 w-full rounded-[24px] bg-white/10 pl-12 pr-4 text-[14px] font-semibold text-white outline-none",
                "placeholder:text-white/45 ring-1 ring-white/15 focus:ring-2 focus:ring-white/25",
              )}
            />
          </div>
        </div>

        <div className={cn("mt-6", "md:grid md:grid-cols-[1fr_320px] md:gap-4")}>
          {/* Map card */}
          <div className="rounded-[26px] bg-white shadow-[0_22px_60px_rgba(0,0,0,0.25)] overflow-hidden">
            <InteractiveMap
              imageSrc={MAP_IMAGE_SRC}
              locations={filteredLocations}
              selectedId={selectedId}
              onPinClick={(id) => onPickLocation(id)}
              apiRef={mapApiRef}
            />
          </div>

          {/* List (side-by-side on wide screens) */}
          <div className="mt-4 md:mt-0 hidden md:block">
            <LocationList
              title="Lista"
              locations={filteredLocations}
              selectedId={selectedId}
              onSelect={(id) => onPickLocation(id)}
            />
          </div>
        </div>

        {/* Mobile collapsible list button */}
        <div className="mt-4 pb-[110px] md:hidden">
          <button
            type="button"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[26px] bg-white/10 text-[14px] font-extrabold text-white ring-1 ring-white/15"
            onClick={() => setListOpen(true)}
          >
            <List className="h-5 w-5" />
            Lista
          </button>
        </div>
      </div>

      {/* Mobile list bottom-sheet */}
      <Dialog.Root open={listOpen} onOpenChange={setListOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 w-full md:left-1/2 md:max-w-[430px] md:-translate-x-1/2 rounded-t-[28px] bg-white shadow-2xl ring-1 ring-black/10">
            <div className="flex items-center justify-between px-4 pt-4">
              <div className="text-[14px] font-extrabold text-zinc-900">Lista</div>
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
            <div className="px-4 pb-4 pt-2">
              <LocationList
                title=""
                compact
                locations={filteredLocations}
                selectedId={selectedId}
                onSelect={(id) => {
                  onPickLocation(id);
                  setListOpen(false);
                }}
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Location bottom sheet */}
      <MapBottomSheet
        open={selectedId != null}
        onOpenChange={(o) => !o && setSelectedId(null)}
        title={title}
        category={selected ? labelForCategory(selected.category) : ""}
        description={selected?.description || "Descripción pendiente"}
      />
    </div>
  );
}

