"use client";

import { useRef } from "react";
import Link from "next/link";
import type { MapPoint } from "@/lib/types";
import { useAppConfig } from "@/lib/content/useAppConfig";
import { EventLogo } from "@/components/branding/EventLogo";
import { InteractiveMap } from "@/components/mapa/InteractiveMap";

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

export function MapaView({ points }: { points: MapPoint[] }) {
  void points;
  const cfg = useAppConfig();
  const mapApiRef = useRef<{ centerOn: (x: number, y: number) => void } | null>(null);

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

        {/* Map (image + pinch-to-zoom + pan) */}
        <div className="mt-8 rounded-[26px] bg-white shadow-[0_22px_60px_rgba(0,0,0,0.25)] overflow-hidden">
          <InteractiveMap
            imageSrc={MAP_IMAGE_SRC}
            locations={[]}
            selectedId={null}
            onPinClick={() => undefined}
            apiRef={mapApiRef}
          />
        </div>
      </div>
    </div>
  );
}

