"use client";

import { Card } from "@/components/ui/Card";
import { useAppConfig } from "@/lib/content/useAppConfig";

export function PrivacyClient() {
  const cfg = useAppConfig();
  const text = cfg.privacyText || "";

  return (
    <Card className="p-5">
      <div className="grid gap-3">
        {text.split("\n\n").map((p, idx) => (
          <p key={idx} className="text-[14px] leading-6 text-zinc-800">
            {p}
          </p>
        ))}
      </div>
    </Card>
  );
}

