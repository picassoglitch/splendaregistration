"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import type { AgendaItem } from "@/lib/types";

export function AgendaItemRow({
  item,
  isFavorite,
}: {
  item: AgendaItem;
  isFavorite?: boolean;
}) {
  return (
    <Link
      href={`/agenda/${item.id}`}
      className={cn(
        "group block px-4 py-3 transition",
        "hover:bg-zinc-50 active:bg-zinc-100",
      )}
    >
      <div className="grid grid-cols-[68px_1fr_72px] items-center gap-3">
        <div className="text-[13px] font-extrabold text-zinc-900">
          {item.startTime}
        </div>
        <div className="min-w-0">
          <div className="truncate text-[13px] font-semibold text-zinc-900">
            {item.title}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          {isFavorite ? (
            <span
              aria-label="Favorito"
              className="inline-flex h-2.5 w-2.5 rounded-full bg-brand-600"
            />
          ) : (
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-zinc-200" />
          )}
          <div className="truncate text-right text-[12px] font-semibold text-zinc-600">
            {item.location}
          </div>
        </div>
      </div>
    </Link>
  );
}

