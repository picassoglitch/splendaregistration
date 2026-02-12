"use client";

import Link from "next/link";
import { useAppConfig } from "@/lib/content/useAppConfig";
import { EventLogo } from "@/components/branding/EventLogo";

/** Top-left logo button linking to /home. Image fills circle via object-cover; no background so no ghost.
 * VISUAL CHECK: Agenda, Map, Dresscode @ 390px, 428px, 1024px. */
export function HeaderLogoLink() {
  const cfg = useAppConfig();
  return (
    <Link
      href="/home"
      aria-label="Ir a inicio"
      className="inline-flex shrink-0 overflow-hidden rounded-full"
      style={{ width: 88, height: 88 }}
    >
      <EventLogo
        logoUrl={cfg.logoUrl}
        size={88}
        frame={false}
        fit="cover"
        className="h-full w-full rounded-full"
      />
    </Link>
  );
}
