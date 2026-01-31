"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { EventLogo } from "@/components/branding/EventLogo";
import { DEFAULT_CONFIG, type AppConfig, writeConfig } from "@/lib/content/appConfig";
import { useAppConfig } from "@/lib/content/useAppConfig";
import { Tabs } from "@/components/ui/Tabs";
import { AgendaAdmin } from "@/app/admin/ui/AgendaAdmin";
import { UsersAdmin } from "@/app/admin/ui/UsersAdmin";
import { useMe } from "@/lib/hooks/useMe";

export function AdminClient() {
  const cfg = useAppConfig();
  const { role, loading: roleLoading } = useMe();
  const isSuperAdmin = role === "super_admin";

  const [draft, setDraft] = useState<AppConfig>(cfg);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"branding" | "agenda" | "users">("branding");

  useEffect(() => {
    setDraft(cfg);
  }, [cfg]);

  const tabOptions = useMemo(() => {
    const opts: Array<{ value: "branding" | "agenda" | "users"; label: string }> = [];
    if (isSuperAdmin) opts.push({ value: "branding", label: "Branding" });
    opts.push({ value: "agenda", label: "Agenda" });
    opts.push({ value: "users", label: "Usuarios" });
    return opts;
  }, [isSuperAdmin]);

  useEffect(() => {
    if (roleLoading) return;
    const allowed = new Set(tabOptions.map((o) => o.value));
    if (!allowed.has(tab)) setTab(isSuperAdmin ? "branding" : "agenda");
  }, [roleLoading, isSuperAdmin, tab, tabOptions]);

  const canSave = useMemo(() => Boolean(draft.eventName.trim()), [draft.eventName]);

  const save = async (next: AppConfig) => {
    setSaving(true);
    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error("save failed");
      const json = (await res.json()) as AppConfig;
      writeConfig(json); // update local cache immediately
      setSavedAt(new Date().toLocaleTimeString("es-MX"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-dvh px-1 pb-8 pt-[max(18px,var(--sat))]">
      <div className="page-in">
        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                Admin
              </div>
              <div className="mt-1 text-[18px] font-extrabold text-zinc-900">
                {isSuperAdmin ? "Contenido & Branding" : "Administración"}
              </div>
              <div className="mt-1 text-[13px] font-semibold text-zinc-600">
                {isSuperAdmin
                  ? "Cambios se guardan en Supabase (y se reflejan en toda la app)."
                  : "Agenda y usuarios (export). Cambios se guardan en Supabase."}
              </div>
            </div>
            <EventLogo logoUrl={draft.logoUrl} size={56} />
          </div>

          <div className="mt-6">
            <Tabs
              value={tab}
              onChange={setTab}
              options={tabOptions}
            />
          </div>

          {tab === "agenda" ? (
            <div className="mt-4">
              <AgendaAdmin />
            </div>
          ) : null}

          {tab === "users" ? (
            <div className="mt-4">
              <UsersAdmin canEditRoles={isSuperAdmin} />
            </div>
          ) : null}

          {tab === "branding" ? (
          <div className="mt-6 grid gap-4">
            <Input
              label="Event name (título)"
              value={draft.eventName}
              onChange={(e) =>
                setDraft((d) => ({ ...d, eventName: e.target.value }))
              }
            />
            <Input
              label="Event tag (e.g., EVENTO)"
              value={draft.eventTag}
              onChange={(e) =>
                setDraft((d) => ({ ...d, eventTag: e.target.value }))
              }
            />
            <Input
              label="Logo URL (opcional)"
              hint="Pega una URL pública de imagen (png/jpg/webp)."
              value={draft.logoUrl}
              onChange={(e) => setDraft((d) => ({ ...d, logoUrl: e.target.value }))}
            />

            <div className="rounded-2xl border border-border bg-surface-2 p-4">
              <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                Landing
              </div>
              <div className="mt-3 grid gap-4">
                <Input
                  label="Landing title"
                  value={draft.landingTitle}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, landingTitle: e.target.value }))
                  }
                />
                <Input
                  label="Landing subtitle"
                  value={draft.landingSubtitle}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, landingSubtitle: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface-2 p-4">
              <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                Mapa
              </div>
              <textarea
                className="mt-3 min-h-[86px] w-full rounded-2xl border border-border bg-white px-4 py-3 text-[14px] font-semibold text-zinc-800 shadow-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-200/55"
                value={draft.mapDescription}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, mapDescription: e.target.value }))
                }
              />
            </div>

            <div className="rounded-2xl border border-border bg-surface-2 p-4">
              <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                Aviso de privacidad
              </div>
              <div className="mt-2 text-[13px] font-semibold text-zinc-600">
                Párrafos separados por línea en blanco.
              </div>
              <textarea
                className="mt-3 min-h-[220px] w-full rounded-2xl border border-border bg-white px-4 py-3 text-[14px] text-zinc-800 shadow-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-200/55"
                value={draft.privacyText}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, privacyText: e.target.value }))
                }
              />
            </div>

            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              <PrimaryButton
                onClick={() => save(draft)}
                disabled={!canSave}
                isLoading={saving}
              >
                Guardar cambios
              </PrimaryButton>
              <PrimaryButton
                variant="secondary"
                onClick={() => save(DEFAULT_CONFIG)}
                isLoading={saving}
              >
                Restaurar defaults
              </PrimaryButton>
            </div>

            {savedAt ? (
              <div className="text-center text-[12px] font-semibold text-zinc-500">
                Guardado: {savedAt}
              </div>
            ) : null}
          </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}

