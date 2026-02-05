"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { AgendaItem } from "@/lib/types";
import { getAgendaItems } from "@/lib/data/agenda";
import { DATA_EVENT, fetchAgendaOverride } from "@/lib/data/overrides";
import { useAppConfig } from "@/lib/content/useAppConfig";
import { EventLogo } from "@/components/branding/EventLogo";
import { cn } from "@/lib/cn";

function sortAgenda(items: AgendaItem[]) {
  return items.slice().sort((a, b) => {
    if (a.day !== b.day) return a.day.localeCompare(b.day);
    return a.startTime.localeCompare(b.startTime);
  });
}

const MONTHS_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"] as const;

function formatDayShort(day: string) {
  // expected: YYYY-MM-DD
  try {
    const d = new Date(`${day}T00:00:00`);
    if (Number.isNaN(d.getTime())) return day;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = MONTHS_ES[d.getMonth()] ?? "";
    return mm ? `${dd} ${mm}` : dd;
  } catch {
    return day;
  }
}

function DayToggle({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div
      className="mx-auto w-[calc(100%-28px)] max-w-[440px] rounded-[26px] bg-[#173A73]/80 px-5 py-4 ring-1 ring-white/15 backdrop-blur-md"
      role="tablist"
      aria-label="Días de agenda"
    >
      <div className="flex w-full items-center justify-between gap-6">
        {options.map((opt) => {
          const active = opt === value;
          const label = formatDayShort(opt);
          return (
            <button
              key={opt}
              type="button"
              role="tab"
              aria-selected={active}
              className="flex flex-col items-center gap-2 outline-none focus-visible:ring-4 focus-visible:ring-white/25 rounded-2xl px-2 py-1"
              onClick={() => onChange(opt)}
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
                {label}
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
  const [override, setOverride] = useState<AgendaItem[] | null>(null);
  const [day, setDay] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      const next = await fetchAgendaOverride();
      if (!cancelled) setOverride(next);
    };
    const onEvent = () => {
      refresh().catch(() => undefined);
    };
    refresh().catch(() => undefined);
    const t = window.setInterval(() => refresh().catch(() => undefined), 2000);
    window.addEventListener(DATA_EVENT, onEvent as EventListener);
    return () => {
      cancelled = true;
      window.clearInterval(t);
      window.removeEventListener(DATA_EVENT, onEvent as EventListener);
    };
  }, []);

  const items = useMemo(() => {
    const base = override ?? getAgendaItems();
    return sortAgenda(base);
  }, [override]);

  const days = useMemo(() => {
    const uniq = new Set<string>();
    for (const it of items) {
      if (it.day) uniq.add(it.day);
    }
    return Array.from(uniq).sort((a, b) => a.localeCompare(b));
  }, [items]);

  useEffect(() => {
    if (!days.length) return;
    if (!day || !days.includes(day)) setDay(days[0] || "");
  }, [days, day]);

  const filtered = useMemo(() => {
    if (!day) return items;
    return items.filter((x) => x.day === day);
  }, [items, day]);

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
              {day ? formatDayShort(day) : ""}
            </div>
          </div>
          <div className="w-[46px]" />
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-[72px_1fr_74px] gap-3 px-2 text-[13px] font-semibold text-white/80">
            <div className="text-left"> </div>
            <div className="text-center"> </div>
            <div className="text-right"> </div>
          </div>

          <div className="mt-3 grid gap-4 pb-[110px]">
            {filtered.map((item) => (
              <Link
                key={item.id}
                href={`/agenda/${encodeURIComponent(item.id)}`}
                className="grid grid-cols-[72px_1fr_74px] items-center gap-3 px-2"
              >
                <div className="text-[16px] font-semibold text-white">
                  {item.startTime}
                </div>
                <div className="text-center text-[14px] font-medium text-white/95">
                  {item.title}
                </div>
                <div className="text-right text-[14px] font-medium text-white/95">
                  {item.location}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom track selector */}
      <div
        className="fixed left-1/2 z-20 w-full max-w-[480px] -translate-x-1/2"
        style={{ bottom: "max(14px, var(--sab))" }}
      >
        <DayToggle value={day} onChange={setDay} options={days} />
      </div>
    </div>
  );
}

