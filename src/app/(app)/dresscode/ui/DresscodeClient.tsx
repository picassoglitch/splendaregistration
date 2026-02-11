"use client";

import Link from "next/link";
import { useAppConfig } from "@/lib/content/useAppConfig";
import { EventLogo } from "@/components/branding/EventLogo";
import { cn } from "@/lib/cn";
import { useMemo, useState } from "react";

type NextWindow = {
  __NEXT_ROUTER_BASEPATH?: string;
  __NEXT_DATA__?: { buildId?: string };
};

function pdfSrc() {
  const win = typeof window !== "undefined" ? (window as unknown as NextWindow) : null;
  const basePath = win?.__NEXT_ROUTER_BASEPATH ? String(win.__NEXT_ROUTER_BASEPATH) : "";
  const buildId = win?.__NEXT_DATA__?.buildId ? String(win.__NEXT_DATA__.buildId) : "";
  return `${basePath}/dresscode.pdf${buildId ? `?v=${buildId}` : ""}`;
}

export function DresscodeClient() {
  const cfg = useAppConfig();
  const [failed, setFailed] = useState(false);

  const src = useMemo(() => pdfSrc(), []);

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
              size={52}
              frame
              className="rounded-full ring-0 shadow-none"
            />
          </Link>
          <div className="flex-1 text-center">
            <div className="text-[34px] font-extrabold tracking-[0.08em]">
              DRESSCODE
            </div>
          </div>
          <div className="w-[52px]" />
        </div>

        <div className="mt-8 rounded-[26px] bg-white shadow-[0_22px_60px_rgba(0,0,0,0.25)] overflow-hidden">
          {!failed ? (
            <iframe
              title="Dresscode"
              src={src}
              className="h-[78dvh] w-full bg-white"
              onError={() => setFailed(true)}
            />
          ) : (
            <div className="p-5">
              <div className="text-[14px] font-extrabold text-zinc-900">
                No se pudo cargar el PDF.
              </div>
              <div className="mt-1 text-[13px] font-semibold text-zinc-600">
                Abre el archivo en una pestaña nueva.
              </div>
              <a
                href={src}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "mt-4 inline-flex h-11 w-full items-center justify-center rounded-2xl",
                  "bg-[#173A73] text-white text-[13px] font-extrabold shadow-sm",
                )}
              >
                Abrir PDF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

