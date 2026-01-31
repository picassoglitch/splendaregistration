"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, ChevronLeft, Home, MapPin, User } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/components/auth/AuthProvider";
import * as Dialog from "@radix-ui/react-dialog";
import { useAppConfig } from "@/lib/content/useAppConfig";
import { EventLogo } from "@/components/branding/EventLogo";
import { useMe } from "@/lib/hooks/useMe";

function titleForPath(pathname: string) {
  if (pathname.startsWith("/agenda/")) return "Detalle";
  if (pathname === "/agenda") return "AGENDA";
  if (pathname === "/mapa") return "MAPA";
  if (pathname === "/home") return "";
  return "Swat & Smart 2026";
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, logout } = useAuth();
  const cfg = useAppConfig();
  const { role, loading, refetch } = useMe();

  const title = titleForPath(pathname);
  const isDetail = pathname.startsWith("/agenda/");

  return (
    <div className="min-h-dvh">
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
              <EventLogo logoUrl={cfg.logoUrl} size={40} />
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
            <Dialog.Root onOpenChange={(open) => open && refetch()}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  aria-label="Usuario"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl hover:bg-zinc-900/5 active:bg-zinc-900/10"
                >
                  <User className="h-5 w-5 text-zinc-900" />
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px]" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-28px)] max-w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-black/10">
                  <Dialog.Title className="text-[16px] font-extrabold text-zinc-900">
                    {profile ? "Tu cuenta" : "Entrar"}
                  </Dialog.Title>
                  <Dialog.Description className="mt-1 text-[13px] text-zinc-600">
                    {profile
                      ? `${profile.name} · ${profile.email}`
                      : "Puedes registrarte o entrar para personalizar (opcional)."}
                  </Dialog.Description>

                  {profile ? (
                    <div className="mt-2 flex items-center justify-between gap-3 text-[12px] font-semibold text-zinc-500">
                      <div>
                        Rol:{" "}
                        <span className="font-extrabold text-zinc-800">
                          {loading ? "cargando…" : (role ?? "—")}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="rounded-xl px-3 py-2 hover:bg-zinc-900/5 active:bg-zinc-900/10"
                        onClick={refetch}
                      >
                        Actualizar
                      </button>
                    </div>
                  ) : null}

                  <div className="mt-4 grid gap-2">
                    {!profile ? (
                      <>
                        <Link
                          href="/login"
                          className="inline-flex h-12 items-center justify-center rounded-2xl bg-brand-600 text-white font-semibold shadow-sm hover:bg-brand-700 active:bg-brand-800"
                        >
                          Entrar
                        </Link>
                        <Link
                          href="/register"
                          className="inline-flex h-12 items-center justify-center rounded-2xl bg-white text-zinc-900 font-semibold ring-1 ring-border hover:bg-zinc-50 active:bg-zinc-100"
                        >
                          Registrarme
                        </Link>
                      </>
                    ) : (
                      <>
                        {role === "super_admin" ? (
                          <Link
                            href="/admin"
                            className="inline-flex h-12 items-center justify-center rounded-2xl bg-brand-600 text-white font-semibold shadow-sm hover:bg-brand-700 active:bg-brand-800"
                          >
                            Panel Admin
                          </Link>
                        ) : null}
                        <button
                          type="button"
                          className="inline-flex h-12 items-center justify-center rounded-2xl bg-white text-zinc-900 font-semibold ring-1 ring-border hover:bg-zinc-50 active:bg-zinc-100"
                          onClick={async () => {
                            await logout();
                            router.push("/");
                          }}
                        >
                          Cerrar sesión
                        </button>
                      </>
                    )}
                  </div>

                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="mt-4 w-full rounded-2xl px-4 py-3 text-[14px] font-semibold text-zinc-600 hover:bg-zinc-900/5 active:bg-zinc-900/10"
                    >
                      Cerrar
                    </button>
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </header>

      <main className="page-in pb-[calc(92px+max(10px,var(--sab)))] pt-4">
        {children}
      </main>

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
        <div className="grid grid-cols-3 gap-2 px-2 py-2">
          <BottomNavItem
            href="/home"
            active={pathname === "/home"}
            label="Inicio"
            icon={<Home className="h-5 w-5" />}
          />
          <BottomNavItem
            href="/agenda"
            active={pathname === "/agenda" || pathname.startsWith("/agenda/")}
            label="Agenda"
            icon={<CalendarDays className="h-5 w-5" />}
          />
          <BottomNavItem
            href="/mapa"
            active={pathname === "/mapa"}
            label="Mapa"
            icon={<MapPin className="h-5 w-5" />}
          />
        </div>
      </nav>
    </div>
  );
}

function BottomNavItem({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 transition",
        active
          ? "bg-brand-600 text-white shadow-sm"
          : "text-zinc-700 hover:bg-zinc-900/5 active:bg-zinc-900/10",
      )}
    >
      {icon}
      <span className="text-[12px] font-semibold">{label}</span>
    </Link>
  );
}

