"use client";

import { useAppConfig } from "@/lib/content/useAppConfig";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const cfg = useAppConfig();
  const router = useRouter();

  const delayMs = Math.min(10000, Math.max(500, Number(cfg.splashDurationMs) || 2400));
  const canSkipMs = 350;
  // Put the exact splash image here:
  // Save the provided screenshot as: /public/splash.png
  const splashSrc = cfg.backgrounds?.splash?.trim() || "/splash.png";

  const startedAt = useMemo(() => Date.now(), []);

  useEffect(() => {
    const t = window.setTimeout(() => router.replace("/unlock"), delayMs);
    return () => window.clearTimeout(t);
  }, [router, delayMs]);

  return (
    <button
      type="button"
      className="fixed inset-0 left-1/2 w-full max-w-[480px] -translate-x-1/2 overflow-hidden"
      style={{ backgroundColor: "#1C3D78" }}
      aria-label="Abrir"
      onClick={() => {
        const elapsed = Date.now() - startedAt;
        if (elapsed < canSkipMs) return;
        router.replace("/unlock");
      }}
    >
      {/* Keep config "used" (avoid unused import if cfg is later removed) */}
      <span className="sr-only">{cfg.eventName}</span>

      <div className="absolute inset-0">
        <Image
          src={splashSrc}
          alt={`${cfg.eventName} splash`}
          fill
          priority
          sizes="100vw"
          className="page-in object-contain [transform:scale(1.10)]"
        />
      </div>
    </button>
  );
}
