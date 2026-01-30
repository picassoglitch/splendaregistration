"use client";

import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { PrimaryLinkButton } from "@/components/ui/PrimaryButton";
import { SupportFooter } from "@/components/SupportFooter";
import { useAppConfig } from "@/lib/content/useAppConfig";
import { EventLogo } from "@/components/branding/EventLogo";

export function HomeClient() {
  const cfg = useAppConfig();
  return (
    <div className="px-1">
      <div className="mx-auto flex min-h-[calc(100dvh-160px)] max-w-[420px] flex-col items-center justify-center">
        <EventLogo logoUrl={cfg.logoUrl} size={80} className="rounded-full" />

        <div className="mt-8 w-full space-y-4">
          <PrimaryLinkButton
            href="/agenda"
            leftIcon={<CalendarDays className="h-5 w-5" />}
          >
            Agenda
          </PrimaryLinkButton>
          <PrimaryLinkButton href="/mapa" leftIcon={<MapPin className="h-5 w-5" />}>
            Mapa
          </PrimaryLinkButton>
        </div>

        <Link
          href="/privacidad"
          className="mt-6 text-center text-[12px] font-semibold text-zinc-600 hover:text-zinc-900"
        >
          Aviso de privacidad
        </Link>
      </div>

      <SupportFooter />
    </div>
  );
}

