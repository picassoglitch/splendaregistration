"use client";

import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-zinc-200/70",
        "dark:bg-zinc-800/70",
        className,
      )}
    />
  );
}

