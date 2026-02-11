"use client";

import Link from "next/link";
import { useAppConfig } from "@/lib/content/useAppConfig";
import { EventLogo } from "@/components/branding/EventLogo";

export function DresscodeClient() {
  const cfg = useAppConfig();

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
              DRESSCODE
            </div>
          </div>
          <div className="w-[88px]" />
        </div>

        {/* In-app content (native UI) */}
        <div className="mt-8 rounded-[26px] bg-white shadow-[0_22px_60px_rgba(0,0,0,0.25)] overflow-hidden">
          <div className="p-5 sm:p-6">
            <div className="text-center">
              <div className="text-[22px] font-extrabold tracking-[0.08em] text-[#173A73]">
                SAVE THE DATE
              </div>
              <div className="mt-3 text-[44px] leading-none font-extrabold text-[#173A73]">
                17, 18 &amp; 19
              </div>
              <div className="mt-1 text-[18px] font-extrabold tracking-[0.10em] text-[#173A73]/90">
                DE FEBRERO 2026
              </div>
              <div className="mt-3 text-[12px] font-semibold text-zinc-600">
                Lugar: Hotel La Casa de los Árboles | Zacualpan de Amilpas, Mor.
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-[#173A73] px-4 py-4 text-white shadow-sm">
                <div className="inline-flex h-9 items-center rounded-full bg-white/10 px-4 text-[13px] font-extrabold tracking-[0.10em] ring-1 ring-white/20">
                  DÍA 1
                </div>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
                    <div className="text-[12px] font-extrabold tracking-[0.10em] text-white/90">
                      Outfit 1
                    </div>
                    <div className="mt-1 text-[13px] font-semibold">
                      Jeans y camisa/blusa blanca
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
                    <div className="text-[12px] font-extrabold tracking-[0.10em] text-white/90">
                      Outfit 2
                    </div>
                    <div className="mt-1 text-[13px] font-semibold">
                      Cena ALL BLACK <span className="text-white/90">(NO TACONES)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-[#173A73] px-4 py-4 text-white shadow-sm">
                <div className="inline-flex h-9 items-center rounded-full bg-white/10 px-4 text-[13px] font-extrabold tracking-[0.10em] ring-1 ring-white/20">
                  DÍA 2
                </div>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
                    <div className="text-[12px] font-extrabold tracking-[0.10em] text-white/90">
                      Outfit 1
                    </div>
                    <div className="mt-1 text-[13px] font-semibold">Ropa y tenis deportivos</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
                    <div className="text-[12px] font-extrabold tracking-[0.10em] text-white/90">
                      Outfit 2
                    </div>
                    <div className="mt-1 text-[13px] font-semibold">Business casual</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
                    <div className="text-[12px] font-extrabold tracking-[0.10em] text-white/90">
                      Outfit 3
                    </div>
                    <div className="mt-1 text-[13px] font-semibold">BBQ</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-[#173A73] px-4 py-4 text-white shadow-sm">
                <div className="inline-flex h-9 items-center rounded-full bg-white/10 px-4 text-[13px] font-extrabold tracking-[0.10em] ring-1 ring-white/20">
                  DÍA 3
                </div>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
                    <div className="text-[12px] font-extrabold tracking-[0.10em] text-white/90">
                      Outfit 1
                    </div>
                    <div className="mt-1 text-[13px] font-semibold">Libre, outfit de regreso</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

