"use client";

import Link from "next/link";
import { SupportFooter } from "@/components/SupportFooter";
import { useAppConfig } from "@/lib/content/useAppConfig";
import { EventLogo } from "@/components/branding/EventLogo";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { LogOut } from "lucide-react";
import { clearAccess } from "@/lib/access";

export function HomeClient() {
  const cfg = useAppConfig();
  const router = useRouter();

  const btn =
    "h-[88px] w-full rounded-[22px] bg-[#FFE45A] text-[#F3A12A] text-[26px] font-extrabold tracking-wide shadow-[0_18px_40px_rgba(0,0,0,0.18)]";
  return (
    <div
      className={cn(
        "min-h-dvh w-full px-6",
        "pt-[max(22px,var(--sat))] pb-[max(18px,var(--sab))]",
        "text-white",
      )}
    >
      <div className="mx-auto flex min-h-dvh max-w-[420px] flex-col items-center">
        <div className="flex w-full items-center justify-end pt-1">
          <button
            type="button"
            aria-label="Salir"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur-sm active:scale-[0.99]"
            onClick={() => {
              clearAccess();
              fetch("/api/access", { method: "DELETE" }).catch(() => undefined);
              router.replace("/unlock");
            }}
          >
            <LogOut className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="mt-8 flex w-full items-center justify-center">
          <EventLogo
            logoUrl={cfg.logoUrl}
            size={192}
            frame={cfg.logoStyle !== "plain"}
            className={cfg.logoStyle !== "plain" ? "rounded-full shadow-[0_26px_70px_rgba(0,0,0,0.35)]" : ""}
          />
        </div>

        <div className="mt-6 text-center">
          <div className="text-[12px] font-bold tracking-[0.22em] text-white/70">
            {cfg.eventTag}
          </div>
          <div className="mt-1 text-[20px] font-extrabold tracking-tight text-white">
            {cfg.eventName}
          </div>
          {cfg.homeSubtitle ? (
            <div className="mt-2 text-[13px] font-semibold text-white/80">
              {cfg.homeSubtitle}
            </div>
          ) : null}
        </div>

        <div className="mt-10 w-full space-y-6">
          <button type="button" className={btn} onClick={() => router.push("/agenda")}>
            {(cfg.homeAgendaLabel || "AGENDA").toUpperCase()}
          </button>
          <button type="button" className={btn} onClick={() => router.push("/mapa")}>
            {(cfg.homeMapLabel || "MAPA").toUpperCase()}
          </button>
        </div>

        <div className="mt-auto w-full pb-6 pt-8 text-center">
          <Link href="/privacidad" className="text-[16px] font-semibold text-white/90">
            {cfg.privacyTitle || "Aviso de Privacidad"}
          </Link>
          <div className="mt-2">
            <SupportFooter />
          </div>
        </div>
      </div>
    </div>
  );
}

