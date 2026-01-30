import Image from "next/image";
import { cn } from "@/lib/cn";

export function EventLogo({
  logoUrl,
  size = 56,
  className,
}: {
  logoUrl?: string;
  size?: number;
  className?: string;
}) {
  if (logoUrl) {
    return (
      <div
        className={cn(
          "overflow-hidden rounded-2xl bg-white ring-1 ring-border shadow-sm",
          className,
        )}
        style={{ width: size, height: size }}
      >
        <Image
          src={logoUrl}
          alt="Logo"
          width={size}
          height={size}
          className="h-full w-full object-cover"
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
        style={{ width: Math.max(14, Math.floor(size * 0.38)), height: Math.max(14, Math.floor(size * 0.38)) }}
      />
    </div>
  );
}

