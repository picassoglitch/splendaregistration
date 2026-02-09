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
  key: string; // unique per pin instance (map includes repeated numbers)
  id: number;
  name: string;
  category: LocationCategory;
  x: number;
  y: number;
  description?: string;
}[] = [
  // ÁREAS COMUNES
  { key: "1", id: 1, name: "Estacionamiento", category: "areas_comunes", x: 0.89, y: 0.52, description: "Descripción pendiente" },
  { key: "2", id: 2, name: "Inmersódromo", category: "areas_comunes", x: 0.83, y: 0.44, description: "Descripción pendiente" },
  { key: "3", id: 3, name: "Recepción", category: "areas_comunes", x: 0.80, y: 0.40, description: "Descripción pendiente" },
  { key: "4", id: 4, name: "Bamboo Oficinas", category: "areas_comunes", x: 0.57, y: 0.38, description: "Descripción pendiente" },
  { key: "5-a", id: 5, name: "Floripondios", category: "areas_comunes", x: 0.55, y: 0.34, description: "Descripción pendiente" },
  { key: "5-b", id: 5, name: "Floripondios", category: "areas_comunes", x: 0.62, y: 0.34, description: "Descripción pendiente" },
  { key: "6", id: 6, name: "Murales", category: "areas_comunes", x: 0.55, y: 0.23, description: "Descripción pendiente" },
  { key: "7", id: 7, name: "Arcadas", category: "areas_comunes", x: 0.69, y: 0.20, description: "Descripción pendiente" },
  { key: "8", id: 8, name: "Xochimilco", category: "areas_comunes", x: 0.72, y: 0.26, description: "Descripción pendiente" },
  { key: "9", id: 9, name: "Soles", category: "areas_comunes", x: 0.22, y: 0.65, description: "Descripción pendiente" },
  { key: "10", id: 10, name: "Entrance", category: "areas_comunes", x: 0.08, y: 0.71, description: "Descripción pendiente" },
  { key: "11", id: 11, name: "Mini Golf", category: "areas_comunes", x: 0.10, y: 0.56, description: "Descripción pendiente" },
  { key: "12", id: 12, name: "Aquapark", category: "areas_comunes", x: 0.67, y: 0.80, description: "Descripción pendiente" },

  // HABITACIONES
  { key: "14", id: 14, name: "Thai", category: "habitaciones", x: 0.57, y: 0.63, description: "Descripción pendiente" },
  { key: "15", id: 15, name: "Artes", category: "habitaciones", x: 0.55, y: 0.69, description: "Descripción pendiente" },
  { key: "16", id: 16, name: "Cactus", category: "habitaciones", x: 0.47, y: 0.62, description: "Descripción pendiente" },
  { key: "17-a", id: 17, name: "Japonés", category: "habitaciones", x: 0.52, y: 0.51, description: "Descripción pendiente" },
  { key: "17-b", id: 17, name: "Japonés", category: "habitaciones", x: 0.50, y: 0.55, description: "Descripción pendiente" },
  { key: "19", id: 19, name: "Fresnos", category: "habitaciones", x: 0.43, y: 0.18, description: "Descripción pendiente" },
  { key: "21-a", id: 21, name: "Aguacatillos", category: "habitaciones", x: 0.32, y: 0.20, description: "Descripción pendiente" },
  { key: "21-b", id: 21, name: "Aguacatillos", category: "habitaciones", x: 0.28, y: 0.24, description: "Descripción pendiente" },
  { key: "23", id: 23, name: "Lima", category: "habitaciones", x: 0.31, y: 0.49, description: "Descripción pendiente" },
  { key: "24", id: 24, name: "Casa Rosa", category: "habitaciones", x: 0.28, y: 0.52, description: "Descripción pendiente" },
  { key: "25", id: 25, name: "Azares", category: "habitaciones", x: 0.25, y: 0.45, description: "Descripción pendiente" },

  // RESTAURANTES
  { key: "26", id: 26, name: "Naranjos", category: "restaurantes", x: 0.78, y: 0.32, description: "Descripción pendiente" },
  { key: "27", id: 27, name: "Recuerdos", category: "restaurantes", x: 0.64, y: 0.42, description: "Descripción pendiente" },
  { key: "28", id: 28, name: "Senderos", category: "restaurantes", x: 0.41, y: 0.44, description: "Descripción pendiente" },
  { key: "29", id: 29, name: "Moneditas", category: "restaurantes", x: 0.36, y: 0.31, description: "Descripción pendiente" },
  { key: "30", id: 30, name: "Corales", category: "restaurantes", x: 0.84, y: 0.70, description: "Descripción pendiente" },
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const cfg = useAppConfig();
  const mapApiRef = useRef<{ centerOn: (x: number, y: number) => void } | null>(null);

  const selected = useMemo(
    () => MAP_LOCATIONS.find((x) => x.key === selectedId) ?? null,
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

  const onPickLocation = (key: string) => {
    setSelectedId(key);
    const loc = MAP_LOCATIONS.find((x) => x.key === key);
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
              onPinClick={(key) => onPickLocation(key)}
              apiRef={mapApiRef}
            />
          </div>

          {/* List (side-by-side on wide screens) */}
          <div className="mt-4 md:mt-0 hidden md:block">
            <LocationList
              title="Lista"
              locations={filteredLocations}
              selectedId={selectedId}
              onSelect={(key) => onPickLocation(key)}
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
                onSelect={(key) => {
                  onPickLocation(key);
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

