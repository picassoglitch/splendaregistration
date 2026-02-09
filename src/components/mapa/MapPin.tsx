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
        "h-11 w-11 rounded-full",
        "ring-2 ring-white shadow-[0_10px_24px_rgba(0,0,0,0.35)]",
        "bg-[#1C3D78] text-white text-[14px] font-extrabold",
        "outline-none focus-visible:ring-4 focus-visible:ring-white/35",
        active ? "scale-[1.05] bg-[#FFE45A] text-[#173A73]" : null,
      )}
      style={{ left: `${Math.round(x * 10000) / 100}%`, top: `${Math.round(y * 10000) / 100}%` }}
      aria-label={`Ubicación ${id}`}
      onClick={onClick}
    >
      {id}
    </button>
  );
}

