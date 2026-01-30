"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type TabsOption<T extends string> = {
  value: T;
  label: string;
};

export function Tabs<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: TabsOption<T>[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full rounded-2xl bg-white p-1 ring-1 ring-border shadow-sm",
        className,
      )}
      role="tablist"
      aria-label="Filtros"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            className={cn(
              "flex-1 rounded-2xl px-3 py-2 text-[13px] font-semibold transition",
              active
                ? "bg-brand-600 text-white shadow-sm"
                : "text-zinc-700 hover:bg-zinc-900/5 active:bg-zinc-900/10",
            )}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

