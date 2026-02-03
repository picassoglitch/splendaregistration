import Image from "next/image";
import { cn } from "@/lib/cn";

export function EventLogo({
  logoUrl,
  size = 56,
  className,
  fit = "contain",
  frame = true,
}: {
  logoUrl?: string;
  size?: number;
  className?: string;
  fit?: "contain" | "cover";
  frame?: boolean;
}) {
  if (logoUrl) {
    const pad = fit === "contain" ? Math.max(2, Math.round(size * 0.08)) : 0;
    return (
      <div
        className={cn(
          frame
            ? "overflow-hidden rounded-2xl bg-transparent ring-1 ring-white/10 shadow-sm"
            : "bg-transparent",
          className,
        )}
        style={{ width: size, height: size, padding: frame ? pad : 0 }}
      >
        <Image
          src={logoUrl}
          alt="Logo"
          width={size}
          height={size}
          className={cn(
            "h-full w-full",
            fit === "contain" ? "object-contain" : "object-cover",
          )}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl bg-brand-600/15 ring-1 ring-brand-200 flex items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
      aria-label="Logo"
    >
      <div
        className="rounded-full bg-brand-600"
        style={{
          width: Math.max(14, Math.floor(size * 0.38)),
          height: Math.max(14, Math.floor(size * 0.38)),
        }}
      />
    </div>
  );
}

