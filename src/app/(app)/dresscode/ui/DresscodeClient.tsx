"use client";

import { HeaderLogoLink } from "@/components/branding/HeaderLogoLink";

/*
 * VISUAL REGRESSION CHECKLIST (dresscode):
 * - Mobile 390px: 1-col stack, readable, no horizontal scroll
 * - Tablet 768px: 3 cols, cards aligned
 * - Desktop 1024px: centered, max-width, no huge margins
 */
export function DresscodeClient() {
  return (
    <div className="min-h-dvh text-white">
      <div className="mx-auto max-w-[420px] px-6 pt-[max(26px,var(--sat))]">
        <div className="flex items-center justify-between">
          <HeaderLogoLink />
          <div className="flex-1 text-center">
            <div className="text-[28px] font-extrabold tracking-[0.08em] sm:text-[34px]">
              DRESSCODE
            </div>
          </div>
          <div className="w-[88px]" />
        </div>

        {/* In-app content (native UI) - matches Agenda card pattern */}
        <div className="mt-8 rounded-[26px] bg-white shadow-[0_22px_60px_rgba(0,0,0,0.25)] overflow-hidden">
          <div className="p-5 sm:p-6">
            <div className="text-center">
              <div className="text-[18px] font-extrabold tracking-[0.08em] text-[#173A73] sm:text-[22px]">
                SAVE THE DATE
              </div>
              <div className="mt-3 text-[36px] leading-tight font-extrabold text-[#173A73] sm:text-[44px]">
                17, 18 &amp; 19
              </div>
              <div className="mt-1 text-[16px] font-extrabold tracking-[0.10em] text-[#173A73]/90 sm:text-[18px]">
                DE FEBRERO 2026
              </div>
              <div className="mt-3 text-[11px] font-semibold text-zinc-600 leading-snug sm:text-[12px]">
                Lugar: Hotel La Casa de los Árboles | Zacualpan de Amilpas, Mor.
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-3 md:grid-cols-3">
              <div className="min-w-0 rounded-2xl bg-[#173A73] px-4 py-4 text-white shadow-sm">
                <div className="inline-flex h-9 items-center rounded-full bg-white/10 px-4 text-[13px] font-extrabold tracking-[0.10em] ring-1 ring-white/20">
                  DÍA 1
                </div>
                <div className="mt-4 grid gap-3">
                  <div className="min-w-0 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
                    <div className="text-[12px] font-extrabold tracking-[0.10em] text-white/90">
                      Outfit 1
                    </div>
                    <div className="mt-1 break-words text-[13px] font-semibold leading-snug">
                      Jeans y camisa/blusa blanca
                    </div>
                  </div>
                  <div className="min-w-0 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
                    <div className="text-[12px] font-extrabold tracking-[0.10em] text-white/90">
                      Outfit 2
                    </div>
                    <div className="mt-1 break-words text-[13px] font-semibold leading-snug">
                      Cena ALL BLACK <span className="text-white/90">(NO TACONES)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="min-w-0 rounded-2xl bg-[#173A73] px-4 py-4 text-white shadow-sm">
                <div className="inline-flex h-9 items-center rounded-full bg-white/10 px-4 text-[13px] font-extrabold tracking-[0.10em] ring-1 ring-white/20">
                  DÍA 2
                </div>
                <div className="mt-4 grid gap-3">
                  <div className="min-w-0 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
                    <div className="text-[12px] font-extrabold tracking-[0.10em] text-white/90">
                      Outfit 1
                    </div>
                    <div className="mt-1 break-words text-[13px] font-semibold leading-snug">Ropa y tenis deportivos</div>
                  </div>
                  <div className="min-w-0 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
                    <div className="text-[12px] font-extrabold tracking-[0.10em] text-white/90">
                      Outfit 2
                    </div>
                    <div className="mt-1 break-words text-[13px] font-semibold leading-snug">Business casual</div>
                  </div>
                  <div className="min-w-0 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
                    <div className="text-[12px] font-extrabold tracking-[0.10em] text-white/90">
                      Outfit 3
                    </div>
                    <div className="mt-1 break-words text-[13px] font-semibold leading-snug">BBQ</div>
                  </div>
                </div>
              </div>

              <div className="min-w-0 rounded-2xl bg-[#173A73] px-4 py-4 text-white shadow-sm">
                <div className="inline-flex h-9 items-center rounded-full bg-white/10 px-4 text-[13px] font-extrabold tracking-[0.10em] ring-1 ring-white/20">
                  DÍA 3
                </div>
                <div className="mt-4 grid gap-3">
                  <div className="min-w-0 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
                    <div className="text-[12px] font-extrabold tracking-[0.10em] text-white/90">
                      Outfit 1
                    </div>
                    <div className="mt-1 break-words text-[13px] font-semibold leading-snug">Libre, outfit de regreso</div>
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

