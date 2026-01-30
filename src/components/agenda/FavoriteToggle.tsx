"use client";

import { useMemo } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/cn";
import { setFavorites } from "@/lib/storage";
import { useFavoritesSet } from "@/lib/hooks/useStorage";

export function FavoriteToggle({ agendaId }: { agendaId: string }) {
  const favorites = useFavoritesSet();
  const fav = favorites.has(agendaId);

  const label = useMemo(
    () => (fav ? "En favoritos" : "Agregar a favoritos"),
    [fav],
  );

  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl font-semibold transition",
        fav
          ? "bg-brand-600 text-white shadow-sm hover:bg-brand-700 active:bg-brand-800"
          : "bg-white text-zinc-900 ring-1 ring-border hover:bg-zinc-50 active:bg-zinc-100",
      )}
      onClick={() => {
        const ids = new Set(favorites);
        if (ids.has(agendaId)) ids.delete(agendaId);
        else ids.add(agendaId);
        setFavorites(ids);
      }}
    >
      <Heart className={cn("h-5 w-5", fav ? "fill-white" : null)} />
      {label}
    </button>
  );
}

