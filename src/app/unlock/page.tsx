"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { EventLogo } from "@/components/branding/EventLogo";
import { useAppConfig } from "@/lib/content/useAppConfig";
import { cn } from "@/lib/cn";
import { clearAccess, setAccess, type AppAccess, getAccess } from "@/lib/access";
import Image from "next/image";

function Blob({
  className,
  color,
}: {
  className?: string;
  color: "yellow" | "cyan" | "navy";
}) {
  const bg =
    color === "yellow"
      ? "bg-[#FFE45A]"
      : color === "cyan"
        ? "bg-[#23C7FF]"
        : "bg-[#173A73]";
  return (
    <div
      aria-hidden
      className={cn("absolute opacity-100", bg, className)}
      style={{ borderRadius: "9999px" }}
    />
  );
}

export default function UnlockPage() {
  const cfg = useAppConfig();
  const router = useRouter();

  const [password, setPasswordState] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const startedAt = useMemo(() => Date.now(), []);

  useEffect(() => {
    // Never trust localStorage for auth; verify via httpOnly cookie.
    const run = async () => {
      try {
        const res = await fetch("/api/access", { cache: "no-store" });
        if (!res.ok) throw new Error("bad");
        const json = (await res.json()) as { access?: AppAccess | null };
        const access = json.access ?? null;
        if (!access) {
          clearAccess();
          return;
        }
        setAccess(access);
        router.replace(access === "admin" ? "/admin" : "/home");
      } catch {
        // ignore
      }
    };
    run().catch(() => undefined);
  }, [router]);

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const pass = password.trim();
    try {
      const res = await fetch("/api/access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: pass }),
      });
      if (!res.ok) {
        setError("Contraseña incorrecta.");
        setSubmitting(false);
        return;
      }
      const json = (await res.json()) as { access?: AppAccess };
      const access = json.access === "admin" ? "admin" : "user";
      // Keep localStorage in sync for client-side route gating and UI.
      setAccess(access);

      // micro-delay to let button feel responsive on mobile
      const elapsed = Date.now() - startedAt;
      if (elapsed < 250) await new Promise((r) => setTimeout(r, 250 - elapsed));

      router.replace(access === "admin" ? "/admin" : "/home");
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
      setSubmitting(false);
    }
  };

  return (
    <div className="relative w-full min-h-dvh overflow-hidden bg-[#1C3D78]">
      {cfg.backgrounds?.unlock?.trim() ? (
        <div className="absolute inset-0">
          <Image
            src={cfg.backgrounds.unlock}
            alt="Unlock background"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#1C3D78]/35" />
        </div>
      ) : null}
      {/* blobs like the mock */}
      <Blob className="-left-44 -top-36 h-[380px] w-[380px] lg:h-[500px] lg:w-[500px]" color="yellow" />
      <Blob className="-right-44 -bottom-44 h-[420px] w-[420px] lg:h-[540px] lg:w-[540px]" color="yellow" />
      <Blob className="-left-44 -bottom-44 h-[420px] w-[420px] lg:h-[540px] lg:w-[540px]" color="cyan" />
      <Blob className="-right-44 top-[38%] h-[380px] w-[380px] lg:h-[500px] lg:w-[500px]" color="cyan" />

      {/* inner navy "wave" */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-[84px] mx-auto h-[calc(100%-168px)] w-[92%] max-w-2xl bg-[#173A73]"
        style={{ borderRadius: "44px" }}
      />

      <div className="relative flex min-h-dvh flex-col items-center px-6 pt-[max(18px,var(--sat))]">
        <div className="mt-8 flex flex-col items-center">
          <EventLogo
            logoUrl={cfg.logoUrl}
            size={170}
            frame={cfg.logoStyle !== "plain"}
            className={cfg.logoStyle !== "plain" ? "rounded-full shadow-[0_26px_70px_rgba(0,0,0,0.35)]" : ""}
          />
        </div>

        <div className="mt-10 w-full max-w-md mx-auto">
          <label className="sr-only" htmlFor="unlock-pass">
            Contraseña
          </label>
          <input
            id="unlock-pass"
            value={password}
            onChange={(e) => setPasswordState(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            type="password"
            placeholder={cfg.unlockPlaceholder || "Password"}
            autoComplete="current-password"
            className={cn(
              "h-14 w-full rounded-[28px] bg-[#102E5E]/75 px-5 text-[16px] font-semibold text-white/90 outline-none",
              "placeholder:text-white/35",
              "ring-1 ring-white/10 focus:ring-2 focus:ring-white/20",
            )}
          />
          {error ? (
            <div className="mt-3 rounded-2xl bg-black/10 px-4 py-3 text-[13px] font-semibold text-[#FFE45A]">
              {error}
            </div>
          ) : null}

          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className={cn(
              "mt-8 h-14 w-full rounded-[28px] bg-white text-[16px] font-extrabold text-[#1C3D78] shadow-[0_18px_40px_rgba(0,0,0,0.20)]",
              "active:scale-[0.99] disabled:opacity-60",
            )}
          >
            {submitting ? "Ingresando…" : (cfg.unlockButtonText || "Entrar")}
          </button>

          <div className="mt-5 text-center text-[12px] font-semibold text-white/45">
            {cfg.unlockFooterText || "Acceso por contraseña"}
          </div>
        </div>
      </div>
    </div>
  );
}

