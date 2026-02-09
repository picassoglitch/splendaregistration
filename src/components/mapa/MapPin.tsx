import { cn } from "@/lib/cn";

export function MapPin({
  id,
  x,
  y,
  active,
  onClick,
}: {
  id: number;
  x: number; // 0..1
  y: number; // 0..1
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2",
        // Keep a big tap target, but render a small visible marker.
        "h-11 w-11 rounded-full bg-transparent",
        "outline-none focus-visible:ring-4 focus-visible:ring-white/35",
      )}
      style={{ left: `${Math.round(x * 10000) / 100}%`, top: `${Math.round(y * 10000) / 100}%` }}
      aria-label={`Ubicación ${id}`}
      onClick={onClick}
    >
      <span
        className={cn(
          "mx-auto flex h-6 w-6 items-center justify-center rounded-full",
          "ring-1 ring-white/90 shadow-[0_6px_14px_rgba(0,0,0,0.28)]",
          "bg-[#1C3D78] text-white text-[11px] font-extrabold leading-none",
          active ? "scale-[1.08] bg-[#FFE45A] text-[#173A73]" : null,
        )}
      >
        {id}
      </span>
    </button>
  );
}

