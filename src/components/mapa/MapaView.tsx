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
type NextWindow = {
  __NEXT_ROUTER_BASEPATH?: string;
  __NEXT_DATA__?: { buildId?: string };
};
const win = typeof window !== "undefined" ? (window as unknown as NextWindow) : null;
const BASE_PATH = win?.__NEXT_ROUTER_BASEPATH ? String(win.__NEXT_ROUTER_BASEPATH) : "";
const BUILD_ID = win?.__NEXT_DATA__?.buildId ? String(win.__NEXT_DATA__.buildId) : "";
// Cache-bust per deploy so users don't get the previous event-map.png on Vercel/CDN.
const MAP_IMAGE_SRC = `${BASE_PATH}/event-map.png${BUILD_ID ? `?v=${BUILD_ID}` : ""}`;

export function MapaView({ points }: { points: MapPoint[] }) {
  void points;
  const cfg = useAppConfig();
  const mapApiRef = useRef<{ centerOn: (x: number, y: number) => void } | null>(null);

  return (
    <div className="min-h-dvh text-white">
      <div className="px-6 pt-[max(26px,var(--sat))]">
        <div className="flex items-center justify-between">
          <Link
            href="/home"
            aria-label="Ir a inicio"
            className="inline-flex rounded-full bg-white/10 p-1 ring-1 ring-white/15 backdrop-blur-sm shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
          >
            <EventLogo
              logoUrl={cfg.logoUrl}
              size={88}
              frame
              className="rounded-full ring-0 shadow-none"
            />
          </Link>
          <div className="flex-1 text-center">
            <div className="text-[34px] font-extrabold tracking-[0.08em]">
              {cfg.mapPageHeading || "MAPA"}
            </div>
          </div>
          <div className="w-[88px]" />
        </div>

        {/* Map (image + pinch-to-zoom + pan) */}
        <div className="mt-8 rounded-[26px] bg-white shadow-[0_22px_60px_rgba(0,0,0,0.25)] overflow-hidden">
          <InteractiveMap
            key={MAP_IMAGE_SRC}
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

