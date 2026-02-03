"use client";

import { SupportFooter } from "@/components/SupportFooter";
import { useAppConfig } from "@/lib/content/useAppConfig";
import { EventLogo } from "@/components/branding/EventLogo";
import Link from "next/link";
import { PrimaryLinkButton } from "@/components/ui/PrimaryButton";
import { CalendarDays, MapPin } from "lucide-react";

export default function Home() {
  const cfg = useAppConfig();
  return (
    <div className="min-h-dvh px-1 pb-6 pt-[max(24px,var(--sat))]">
      <div className="page-in flex min-h-[calc(100dvh-24px)] flex-col">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="mb-6 flex w-full flex-col items-center">
              <EventLogo
                logoUrl={cfg.logoUrl}
                size={128}
                className="rounded-full"
              />
            </div>
            <div className="mt-2 text-center">
              <div className="text-[13px] font-semibold tracking-[0.18em] text-zinc-500">
                {cfg.eventTag}
              </div>
              <h1 className="mt-1 text-[24px] font-extrabold tracking-tight text-zinc-900">
                {cfg.eventName}
              </h1>
              <div className="mt-2 text-[13px] font-semibold text-zinc-600">
                {cfg.landingSubtitle}
              </div>
            </div>
          </div>

          <div className="mt-8 w-full max-w-[420px]">
            <div className="space-y-4">
              <PrimaryLinkButton href="/home">Abrir app</PrimaryLinkButton>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/agenda"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white text-zinc-900 font-semibold ring-1 ring-border hover:bg-zinc-50 active:bg-zinc-100"
                >
                  <CalendarDays className="h-5 w-5" />
                  Agenda
                </Link>
                <Link
                  href="/mapa"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white text-zinc-900 font-semibold ring-1 ring-border hover:bg-zinc-50 active:bg-zinc-100"
                >
                  <MapPin className="h-5 w-5" />
                  Mapa
                </Link>
              </div>
            </div>
          </div>
        </div>

        <SupportFooter />
      </div>
    </div>
  );
}
