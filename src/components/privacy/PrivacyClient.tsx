"use client";

import { useAppConfig } from "@/lib/content/useAppConfig";

export function PrivacyClient() {
  const cfg = useAppConfig();
  const text = cfg.privacyText || "";

  return (
    <div className="grid gap-5">
      {text.split("\n\n").map((p, idx) => (
        <p key={idx} className="text-[14px] leading-6 text-white/90">
          {p}
        </p>
      ))}
    </div>
  );
}

