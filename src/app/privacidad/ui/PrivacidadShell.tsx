"use client";

import { PrivacyClient } from "@/components/privacy/PrivacyClient";
import { useAppConfig } from "@/lib/content/useAppConfig";
import { cn } from "@/lib/cn";
import { EventLogo } from "@/components/branding/EventLogo";
import Link from "next/link";

export function PrivacidadShell() {
  const cfg = useAppConfig();
  const bgUrl = cfg.backgrounds?.privacidad?.trim() || "";

  return (
    <div
      className={cn("min-h-dvh", bgUrl ? "relative overflow-hidden" : null)}
      style={
        bgUrl
          ? {
              backgroundImage: `url(${bgUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="relative">
        <div className="page-in px-6 pb-[max(18px,var(--sab))] pt-[max(26px,var(--sat))] text-white">
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
              <div className="text-[30px] font-extrabold tracking-[0.06em]">
                {(cfg.privacyTitle || "AVISO PRIVACIDAD").toUpperCase()}
              </div>
            </div>
            <div className="w-[46px]" />
          </div>

          <div className="mt-8">
            <PrivacyClient />
          </div>
        </div>
      </div>
    </div>
  );
}

