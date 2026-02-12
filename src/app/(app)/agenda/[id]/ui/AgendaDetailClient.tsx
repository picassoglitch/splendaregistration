"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Clock3, MapPin } from "lucide-react";
import type { AgendaItem } from "@/lib/types";
import { getAgendaItem } from "@/lib/data/agenda";
import { DATA_EVENT, fetchAgendaOverride } from "@/lib/data/overrides";
import { Card } from "@/components/ui/Card";
import { FavoriteToggle } from "@/components/agenda/FavoriteToggle";

function findInOverride(items: AgendaItem[] | null, id: string): AgendaItem | null {
  if (!items) return null;
  const key = decodeURIComponent(id).trim().toLowerCase();
  return items.find((x) => x.id.toLowerCase() === key) ?? null;
}

export function AgendaDetailClient({ id }: { id: string }) {
  const [override, setOverride] = useState<AgendaItem[] | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      const next = await fetchAgendaOverride();
      if (!cancelled) {
        setOverride(next);
        setLoaded(true);
      }
    };
    const onEvent = () => {
      refresh().catch(() => undefined);
    };
    refresh().catch(() => undefined);
    const t = window.setInterval(() => refresh().catch(() => undefined), 30_000);
    window.addEventListener(DATA_EVENT, onEvent as EventListener);
    return () => {
      cancelled = true;
      window.clearInterval(t);
      window.removeEventListener(DATA_EVENT, onEvent as EventListener);
    };
  }, []);

  const item = useMemo(() => {
    return findInOverride(override, id) ?? getAgendaItem(id);
  }, [id, override]);

  if (!item) {
    if (!loaded) {
      return (
        <Card className="p-5">
          <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-200" />
          <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-zinc-200" />
          <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-zinc-200" />
        </Card>
      );
    }
    return (
      <Card className="p-5">
        <div className="text-[16px] font-extrabold text-zinc-900">No encontrado</div>
        <div className="mt-2 text-[13px] font-semibold text-zinc-600">
          Este evento no existe.
        </div>
        <Link
          href="/agenda"
          className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-brand-600 text-white font-semibold shadow-sm hover:bg-brand-700 active:bg-brand-800"
        >
          Volver a Agenda
        </Link>
      </Card>
    );
  }

  const time = `${item.startTime} — ${item.endTime}`;
  const paragraphs = item.description.split("\n\n");

  return (
    <div className="px-1">
      <Card className="overflow-hidden">
        <div className="p-5">
          <div className="text-[18px] font-extrabold tracking-tight text-zinc-900">
            {item.title}
          </div>

          <div className="mt-3 grid gap-2 rounded-2xl bg-surface-2 p-4 ring-1 ring-border">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-zinc-700">
              <Clock3 className="h-4 w-4 text-zinc-500" />
              {time}
            </div>
            <div className="flex items-center gap-2 text-[13px] font-semibold text-zinc-700">
              <MapPin className="h-4 w-4 text-zinc-500" />
              {item.location}
            </div>
            <div className="text-[13px] font-semibold text-zinc-600">
              Categoría:{" "}
              <span className="font-extrabold text-zinc-900">{item.track}</span>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {paragraphs.map((p, idx) => (
              <p key={idx} className="text-[14px] leading-6 text-zinc-800">
                {p}
              </p>
            ))}
          </div>

          <div className="mt-6">
            <FavoriteToggle agendaId={item.id} />
          </div>
        </div>
      </Card>
    </div>
  );
}

