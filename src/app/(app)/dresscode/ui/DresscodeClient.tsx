"use client";

import { useState } from "react";
import Image from "next/image";
import { HeaderLogoLink } from "@/components/branding/HeaderLogoLink";
import { cn } from "@/lib/cn";

const DRESSCODE_DAYS = [
  { key: "17" as const, label: "17" },
  { key: "18" as const, label: "18" },
  { key: "19" as const, label: "19" },
] as const;

type DresscodeDayKey = (typeof DRESSCODE_DAYS)[number]["key"];

export type DresscodeOutfit = {
  title: string;
  description: string;
  images: string[];
};

export type DresscodeDayConfig = {
  outfits: DresscodeOutfit[];
  showVerEjemplos?: boolean;
};

/** Single source of truth: day -> outfits -> title, description, images. */
export const DRESSCODE_CONFIG: Record<DresscodeDayKey, DresscodeDayConfig> = {
  "17": {
    outfits: [
      {
        title: "Outfit 1",
        description: "Jeans y Camisa / Blusa blanca",
        images: ["/outfit1day1f.png", "/outfit1day1m.png"],
      },
      {
        title: "Outfit 2",
        description: "Cena ALL BLACK NO TACONES",
        images: ["/outfit2day1f.png", "/outfit2day1m.png"],
      },
    ],
  },
  "18": {
    outfits: [
      {
        title: "Outfit 1",
        description: "Ropa y tenis deportivos",
        images: ["/outfit1day2f.png", "/outfit1day2m.png"],
      },
      {
        title: "Outfit 2",
        description: "Business casual",
        images: ["/outfit2day2f.png", "/outfit2day2m.png"],
      },
      {
        title: "Outfit 3",
        description: "",
        images: ["/outfit3day2f.png", "/outfit3day2m.png"],
      },
    ],
  },
  "19": {
    outfits: [
      { title: "Libre", description: "outfit de regreso", images: [] },
    ],
    showVerEjemplos: true,
  },
};

const VER_EJEMPLOS_URL = "https://pin.it/4RlV1Ceg0";

/** Same visual pattern as Agenda DayToggle: rounded pill, circle + label, one active. */
function DayToggle({
  value,
  onChange,
}: {
  value: DresscodeDayKey;
  onChange: (v: DresscodeDayKey) => void;
}) {
  return (
    <div
      className="mx-auto w-[calc(100%-28px)] max-w-[402px] rounded-[26px] bg-[#173A73]/80 px-5 py-4 ring-1 ring-white/15 backdrop-blur-md"
      role="tablist"
      aria-label="Días dress code"
    >
      <div className="flex w-full items-center justify-between gap-6">
        {DRESSCODE_DAYS.map((opt) => {
          const active = opt.key === value;
          return (
            <button
              key={opt.key}
              type="button"
              role="tab"
              aria-selected={active}
              className="flex flex-col items-center gap-2 rounded-2xl px-2 py-1 outline-none focus-visible:ring-4 focus-visible:ring-white/25"
              onClick={() => onChange(opt.key)}
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
              <div className={cn("text-[14px] font-extrabold", active ? "text-white" : "text-white/90")}>
                {opt.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Responsive image with fallback placeholder to avoid layout shift. */
function OutfitImage({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative aspect-[4/5] min-h-[180px] w-full overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-lg">
      {failed ? (
        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white/5 text-[12px] font-semibold text-white/50">
          Imagen no disponible
        </div>
      ) : (
        <Image
          src={src}
          alt=""
          fill
          className="object-cover object-center"
          sizes="(max-width: 640px) 100vw, 50vw"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

/*
 * VISUAL REGRESSION CHECKLIST (dresscode):
 * - Mobile 390px: 1-col stack, no horizontal scroll
 * - Tablet/Desktop: 2-col image grid, consistent with Agenda
 */
export function DresscodeClient() {
  const [selectedDay, setSelectedDay] = useState<DresscodeDayKey>("17");
  const config = DRESSCODE_CONFIG[selectedDay];

  return (
    <div className="min-h-dvh text-white">
      <div className="mx-auto max-w-[420px] px-6 pt-[max(26px,var(--sat))] pb-10">
        <div className="flex items-center justify-between">
          <HeaderLogoLink />
          <div className="flex-1 text-center">
            <div className="text-[28px] font-extrabold tracking-[0.08em] sm:text-[34px]">
              DRESS CODE
            </div>
          </div>
          <div className="w-[88px]" />
        </div>

        {/* Header: Save the date */}
        <div className="mt-6 text-center">
          <div className="text-[18px] font-extrabold tracking-[0.08em] text-white sm:text-[22px]">
            SAVE THE DATE
          </div>
          <div className="mt-3 text-[36px] leading-tight font-extrabold text-white sm:text-[44px]">
            17, 18 &amp; 19
          </div>
          <div className="mt-1 text-[16px] font-extrabold tracking-[0.10em] text-white/95 sm:text-[18px]">
            DE FEBRERO 2026
          </div>
          <div className="mt-3 text-[11px] font-semibold text-white/80 leading-snug sm:text-[12px]">
            Lugar: Hotel La Casa de los Árboles | Zacualpan de Amilpas, Mor.
          </div>
        </div>

        {/* Day selector (Agenda-style) */}
        <div className="mt-6">
          <DayToggle value={selectedDay} onChange={setSelectedDay} />
        </div>

        {/* Dynamic content from config */}
        <div className="mt-8 rounded-[26px] bg-[#173A73]/85 shadow-[0_22px_60px_rgba(0,0,0,0.3)] ring-1 ring-white/15 overflow-hidden">
          <div className="p-5 sm:p-6">
            <div className="mb-4 text-center">
              <span className="inline-flex h-9 items-center rounded-full bg-white/10 px-4 text-[13px] font-extrabold tracking-[0.10em] ring-1 ring-white/20">
                Día {selectedDay}
              </span>
            </div>

            {config.outfits.map((outfit, outfitIdx) => (
              <div key={`${selectedDay}-${outfitIdx}-${outfit.title}`} className="mb-6 last:mb-0">
                {/* Outfit card: title + description */}
                <div className="min-w-0 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
                  <div className="text-[12px] font-extrabold tracking-[0.10em] text-white/90">
                    {outfit.title}
                  </div>
                  {outfit.description ? (
                    <div className="mt-1 break-words text-[13px] font-semibold leading-snug text-white">
                      {outfit.description}
                    </div>
                  ) : null}
                </div>

                {/* Images: responsive grid (2 cols desktop, 1 col mobile) */}
                {outfit.images.length > 0 ? (
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {outfit.images.map((src) => (
                      <OutfitImage key={src} src={src} />
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            {config.showVerEjemplos ? (
              <a
                href={VER_EJEMPLOS_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-6 flex w-full items-center justify-center rounded-2xl bg-white/15 py-3 text-[13px] font-extrabold text-white ring-1 ring-white/20 transition hover:bg-white/20 active:scale-[0.99]"
              >
                Ver ejemplos
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
