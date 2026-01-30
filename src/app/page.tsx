"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { SupportFooter } from "@/components/SupportFooter";
import { useAppConfig } from "@/lib/content/useAppConfig";
import { EventLogo } from "@/components/branding/EventLogo";

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
            <LoginForm />
          </div>
        </div>

        <SupportFooter />
      </div>
    </div>
  );
}
