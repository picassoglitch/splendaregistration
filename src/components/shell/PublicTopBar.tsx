"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function PublicTopBar({ title }: { title: string }) {
  const router = useRouter();
  return (
    <header
      className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-md"
      style={{ paddingTop: "max(10px, var(--sat))" }}
    >
      <div className="flex h-14 items-center gap-3 px-2">
        <button
          type="button"
          aria-label="Volver"
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl hover:bg-zinc-900/5 active:bg-zinc-900/10"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-5 w-5 text-zinc-900" />
        </button>
        <div className="flex-1 text-center">
          <div className="text-[16px] font-extrabold tracking-tight text-zinc-900">
            {title}
          </div>
        </div>
        <div className="w-10" />
      </div>
    </header>
  );
}

