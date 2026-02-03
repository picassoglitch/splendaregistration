"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, ChevronLeft, Home, LogOut, MapPin, Shield } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAppConfig } from "@/lib/content/useAppConfig";
import { EventLogo } from "@/components/branding/EventLogo";
import { useEffect, useState } from "react";
import { clearAccess, setAccess, getAccess, type AppAccess } from "@/lib/access";

function titleForPath(pathname: string) {
  if (pathname.startsWith("/agenda/")) return "Detalle";
  if (pathname === "/agenda") return "AGENDA";
  if (pathname === "/mapa") return "MAPA";
  if (pathname === "/admin") return "ADMIN";
  if (pathname === "/home") return "";
  return "Swat & Smart 2026";
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const cfg = useAppConfig();
  const [access, setAccessState] = useState<AppAccess | null>(null);

  const title = titleForPath(pathname);
  const isDetail = pathname.startsWith("/agenda/");

  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  useEffect(() => {
    let cancelled = false;

    const sync = async () => {
      // Prefer server cookie (source of truth)
      try {
        const res = await fetch("/api/access", { cache: "no-store" });
        const json = (await res.json()) as { access?: AppAccess | null };
        const serverAccess = (res.ok ? json.access : null) ?? null;
        if (cancelled) return;
        if (!serverAccess) {
          clearAccess();
          setAccessState(null);
          router.replace("/unlock");
          return;
        }
        setAccess(serverAccess);
        setAccessState(serverAccess);
        if (isAdminRoute && serverAccess !== "admin") {
          router.replace("/home");
        }
      } catch {
        // Fallback to local for offline/dev, but keep existing behavior
        const next = getAccess();
        setAccessState(next);
        if (!next) router.replace("/unlock");
        if (isAdminRoute && next !== "admin") router.replace("/home");
      }
    };

    sync().catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [router, isAdminRoute, pathname]);

  // IMPORTANT: avoid reading localStorage during render (causes SSR/CSR mismatch).
  // We'll render the same DOM initially, then reveal Admin after mount if applicable.
  const showAdmin = access === "admin";

  const bgKey:
    | keyof typeof cfg.backgrounds
    | null =
    pathname === "/home"
      ? "home"
      : pathname === "/agenda"
        ? "agenda"
        : pathname.startsWith("/agenda/")
          ? "agendaDetail"
          : pathname === "/mapa"
            ? "mapa"
            : pathname === "/privacidad"
              ? "privacidad"
              : pathname === "/admin"
                ? "admin"
                : null;
  const bgUrl = bgKey ? cfg.backgrounds?.[bgKey]?.trim() : "";

  return (
    <div className="min-h-dvh">
      {/* Header only on Admin + Detail screens; client pages are full-bleed like the provided mocks */}
      {pathname === "/admin" || isDetail ? (
        <header
          className={cn(
            "sticky top-0 z-30",
            "bg-background/85 backdrop-blur-md",
            "border-b border-border",
          )}
          style={{ paddingTop: "max(10px, var(--sat))" }}
        >
          <div className="flex h-14 items-center gap-3 px-2">
            <div className="flex w-12 items-center justify-start">
              {isDetail ? (
                <button
                  type="button"
                  aria-label="Volver"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl hover:bg-zinc-900/5 active:bg-zinc-900/10"
                  onClick={() => router.back()}
                >
                  <ChevronLeft className="h-5 w-5 text-zinc-900" />
                </button>
              ) : (
                <EventLogo logoUrl={cfg.logoUrl} size={40} frame={cfg.logoStyle !== "plain"} />
              )}
            </div>

            <div className="flex-1 text-center">
              {title ? (
                <>
                  <div className="text-[13px] font-semibold tracking-[0.18em] text-zinc-500">
                    {cfg.eventName}
                  </div>
                  <div className="text-[16px] font-extrabold tracking-tight text-zinc-900">
                    {title}
                  </div>
                </>
              ) : (
                <div className="text-[16px] font-extrabold tracking-tight text-zinc-900">
                  {cfg.eventName}
                </div>
              )}
            </div>

            <div className="flex w-12 items-center justify-end">
              <button
                type="button"
                aria-label="Cerrar sesión"
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl text-zinc-700 hover:bg-zinc-900/5 active:bg-zinc-900/10"
                onClick={() => {
                  clearAccess();
                fetch("/api/access", { method: "DELETE" }).catch(() => undefined);
                  router.replace("/unlock");
                }}
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>
      ) : null}

      <main
        className={cn(
          "page-in",
          pathname === "/admin" || isDetail ? "pb-[calc(92px+max(10px,var(--sab)))] pt-4" : "pb-[max(10px,var(--sab))] pt-0",
          bgUrl ? "relative overflow-hidden" : null,
        )}
        style={
          bgUrl
            ? {
                backgroundImage: `url(${bgUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div className="relative">{children}</div>
      </main>

      {pathname === "/admin" ? (
        <nav
          className={cn(
            "fixed bottom-0 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2",
            "bg-background/85 backdrop-blur-md border-t border-border",
          )}
          style={{
            paddingBottom: "max(10px, var(--sab))",
            paddingLeft: "max(14px, var(--sal))",
            paddingRight: "max(14px, var(--sar))",
          }}
        >
          <div className="grid grid-cols-4 gap-2 px-2 py-2">
            <BottomNavItem
              href="/home"
              active={false}
              label="Inicio"
              icon={<Home className="h-5 w-5" />}
            />
            <BottomNavItem
              href="/agenda"
              active={false}
              label="Agenda"
              icon={<CalendarDays className="h-5 w-5" />}
            />
            <BottomNavItem
              href="/mapa"
              active={false}
              label="Mapa"
              icon={<MapPin className="h-5 w-5" />}
            />
            <BottomNavItem
              href="/admin"
              active={showAdmin}
              label="Admin"
              icon={<Shield className="h-5 w-5" />}
              hidden={!showAdmin}
            />
          </div>
        </nav>
      ) : null}
    </div>
  );
}

function BottomNavItem({
  href,
  label,
  icon,
  active,
  hidden,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  hidden?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 transition",
        active
          ? "bg-brand-600 text-white shadow-sm"
          : "text-zinc-700 hover:bg-zinc-900/5 active:bg-zinc-900/10",
        hidden ? "invisible pointer-events-none" : null,
      )}
    >
      {icon}
      <span className="text-[12px] font-semibold">{label}</span>
    </Link>
  );
}

