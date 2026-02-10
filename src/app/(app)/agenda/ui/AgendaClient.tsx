"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppConfig } from "@/lib/content/useAppConfig";
import { EventLogo } from "@/components/branding/EventLogo";
import { cn } from "@/lib/cn";
import { AGENDA, AGENDA_DAYS, type AgendaDayKey } from "@/lib/data/agendaByDay";

function DayToggle({
  value,
  onChange,
}: {
  value: AgendaDayKey;
  onChange: (v: AgendaDayKey) => void;
}) {
  return (
    <div
      className="mx-auto w-[calc(100%-28px)] max-w-[402px] rounded-[26px] bg-[#173A73]/80 px-5 py-4 ring-1 ring-white/15 backdrop-blur-md"
      role="tablist"
      aria-label="Días de agenda"
    >
      <div className="flex w-full items-center justify-between gap-6">
        {AGENDA_DAYS.map((opt) => {
          const active = opt.key === value;
          return (
            <button
              key={opt.key}
              type="button"
              role="tab"
              aria-selected={active}
              className="flex flex-col items-center gap-2 outline-none focus-visible:ring-4 focus-visible:ring-white/25 rounded-2xl px-2 py-1"
              onClick={() => onChange(opt.key)}
            >
              <div
                className={cn(
                  "h-11 w-11 rounded-full ring-2 ring-white",
                  active ? "bg-white/15" : "bg-transparent",
                )}
              >
                <div
                  className={cn(
                    "mx-auto mt-[9px] h-5 w-5 rounded-full",
                    active ? "bg-white" : "bg-transparent",
                  )}
                />
              </div>
              <div className={cn("text-[14px] font-extrabold", active ? "text-white" : "text-white/90")}>
                {opt.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function AgendaClient() {
  const cfg = useAppConfig();
  const router = useRouter();
  const params = useSearchParams();
  const [day, setDay] = useState<AgendaDayKey>(AGENDA_DAYS[0].key);

  useEffect(() => {
    const q = (params?.get("day") || "").trim().toLowerCase();
    if (q === "17-feb" || q === "18-feb" || q === "19-feb") {
      setDay(q);
    }
  }, [params]);

  const items = useMemo(() => AGENDA[day] ?? [], [day]);

  const dayLabel = useMemo(() => AGENDA_DAYS.find((d) => d.key === day)?.label ?? "", [day]);
  const displayTime = (start: string, end: string) => `${start}–${end}`;

  return (
    <div className="min-h-dvh text-white">
      <div className="px-6 pt-[max(26px,var(--sat))]">
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
            <div className="text-[34px] font-extrabold tracking-[0.06em]">
              {cfg.agendaTitle || "AGENDA"}
            </div>
            <div className="mt-1 text-[18px] font-semibold text-white/90">
              {dayLabel}
            </div>
          </div>
          <div className="w-[46px]" />
        </div>

        <div className="mt-10">
          {/* Desktop/tablet table */}
          <div className="hidden md:block">
            <div className="grid grid-cols-[180px_110px_1fr_170px] gap-3 px-2 text-[12px] font-bold tracking-[0.12em] text-white/70">
              <div>HORARIO</div>
              <div>DURACIÓN</div>
              <div>ACTIVIDAD</div>
              <div className="text-right">LUGAR</div>
            </div>
            <div className="mt-3 grid gap-3 pb-[110px]">
              {items.length ? (
                items.map((it, idx) => (
                  <div
                    key={`${day}-${idx}-${it.start}-${it.activity}`}
                    className="grid grid-cols-[180px_110px_1fr_170px] items-start gap-3 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15"
                  >
                    <div className="text-[14px] font-extrabold text-white">{displayTime(it.start, it.end)}</div>
                    <div className="text-[13px] font-semibold text-white/90">{it.duration}</div>
                    <div className="text-[13px] font-semibold text-white/95">{it.activity}</div>
                    <div className="text-right text-[13px] font-semibold text-white/90">{it.place}</div>
                  </div>
                ))
              ) : (
                <div className="mt-3 rounded-2xl bg-white/10 px-4 py-4 text-[13px] font-semibold text-white/85 ring-1 ring-white/15">
                  No hay actividades para este día.
                </div>
              )}
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden">
            <div className="mt-3 grid gap-3 pb-[110px]">
              {items.length ? (
                items.map((it, idx) => (
                  <div
                    key={`${day}-${idx}-${it.start}-${it.activity}`}
                    className="rounded-2xl bg-white/10 px-4 py-4 ring-1 ring-white/15"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="text-[14px] font-extrabold text-white">{displayTime(it.start, it.end)}</div>
                      <div className="text-[12px] font-semibold text-white/85">{it.duration}</div>
                    </div>
                    <div className="mt-2 text-[14px] font-semibold text-white/95">{it.activity}</div>
                    <div className="mt-2 text-[13px] font-semibold text-white/85">{it.place}</div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-white/10 px-4 py-4 text-[13px] font-semibold text-white/85 ring-1 ring-white/15">
                  No hay actividades para este día.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom day selector */}
      <div
        className="fixed inset-x-0 z-20 w-full md:left-1/2 md:max-w-[430px] md:-translate-x-1/2"
        style={{ bottom: "max(14px, var(--sab))" }}
      >
        <DayToggle
          value={day}
          onChange={(next) => {
            setDay(next);
            router.replace(`/agenda?day=${encodeURIComponent(next)}`);
          }}
        />
      </div>
    </div>
  );
}

