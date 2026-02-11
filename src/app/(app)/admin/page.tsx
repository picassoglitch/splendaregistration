"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAppConfig } from "@/lib/content/useAppConfig";
import { DEFAULT_CONFIG, type AppConfig, writeConfig } from "@/lib/content/appConfig";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Tabs } from "@/components/ui/Tabs";
import { EventLogo } from "@/components/branding/EventLogo";
import {
  clearAgendaOverride,
  clearMapOverride,
  fetchAgendaOverride,
  fetchMapOverride,
  saveAgendaOverride,
  saveMapOverride,
} from "@/lib/data/overrides";
import type { AgendaItem, MapPoint } from "@/lib/types";

type TabKey = "branding" | "pages" | "data";
type BgKey = keyof ReturnType<typeof useAppConfig>["backgrounds"];
type PageKey = "global" | BgKey;

// Agenda is now day-based (fixed 3-day event)
const AGENDA_DAYS = ["2026-02-17", "2026-02-18", "2026-02-19"] as const;
const MONTHS_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"] as const;

function formatDayShort(day: string) {
  try {
    const d = new Date(`${day}T00:00:00`);
    if (Number.isNaN(d.getTime())) return day;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = MONTHS_ES[d.getMonth()] ?? "";
    return mm ? `${dd} ${mm}` : dd;
  } catch {
    return day;
  }
}

function normalizeAgendaItem(it: AgendaItem): AgendaItem {
  return {
    ...it,
    // track is no longer used in the app UI; keep a safe default
    track: "Otros",
    // ensure it matches one of the day buttons (avoid "empty agenda" on the app)
    day: (AGENDA_DAYS as readonly string[]).includes(it.day) ? it.day : AGENDA_DAYS[0],
  };
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });
}

async function uploadAsset(file: File, path: string) {
  const fd = new FormData();
  fd.set("file", file);
  fd.set("path", path);
  fd.set("bucket", "assets");
  fd.set("upsert", "1");
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error("upload_failed");
  const json = (await res.json()) as { publicUrl?: string };
  if (!json.publicUrl) throw new Error("upload_failed");
  // cache-bust on update
  return `${json.publicUrl}?v=${Date.now()}`;
}

function downloadJson(filename: string, obj: unknown) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function isAgendaItem(x: any): x is AgendaItem {
  return (
    x &&
    typeof x === "object" &&
    typeof x.id === "string" &&
    typeof x.title === "string" &&
    typeof x.day === "string" &&
    typeof x.startTime === "string" &&
    typeof x.endTime === "string" &&
    typeof x.location === "string" &&
    typeof x.track === "string" &&
    typeof x.description === "string"
  );
}

function isMapPoint(x: any): x is MapPoint {
  return (
    x &&
    typeof x === "object" &&
    typeof x.id === "string" &&
    typeof x.type === "string" &&
    typeof x.title === "string" &&
    typeof x.description === "string"
  );
}

export default function AdminPage() {
  const cfg = useAppConfig();

  const [tab, setTab] = useState<TabKey>("branding");

  // Branding
  const [eventName, setEventName] = useState(cfg.eventName);
  const [eventTag, setEventTag] = useState(cfg.eventTag);
  const [homeSubtitle, setHomeSubtitle] = useState(cfg.homeSubtitle);
  const [agendaSubtitle, setAgendaSubtitle] = useState(cfg.agendaSubtitle);
  const [landingSubtitle, setLandingSubtitle] = useState(cfg.landingSubtitle);
  const [logoUrl, setLogoUrl] = useState(cfg.logoUrl ?? "");
  const [logoStyle, setLogoStyle] = useState(cfg.logoStyle);
  const logoFileRef = useRef<HTMLInputElement | null>(null);

  // Pages/content
  const [mapDescription, setMapDescription] = useState(cfg.mapDescription);
  const [mapTitle, setMapTitle] = useState(cfg.mapTitle);
  const [mapPageHeading, setMapPageHeading] = useState(cfg.mapPageHeading);
  const [unlockPlaceholder, setUnlockPlaceholder] = useState(cfg.unlockPlaceholder);
  const [unlockButtonText, setUnlockButtonText] = useState(cfg.unlockButtonText);
  const [unlockFooterText, setUnlockFooterText] = useState(cfg.unlockFooterText);
  const [splashDurationMs, setSplashDurationMs] = useState(String(cfg.splashDurationMs ?? 2400));
  const [homeAgendaLabel, setHomeAgendaLabel] = useState(cfg.homeAgendaLabel);
  const [homeMapLabel, setHomeMapLabel] = useState(cfg.homeMapLabel);
  const [agendaTitle, setAgendaTitle] = useState(cfg.agendaTitle);
  const [agendaDayLabel, setAgendaDayLabel] = useState(cfg.agendaDayLabel);

  const [pageKey, setPageKey] = useState<PageKey>("home");
  const [bgKey, setBgKey] = useState<BgKey>("home");
  const bgFileRef = useRef<HTMLInputElement | null>(null);

  // Data overrides
  const [agendaInfo, setAgendaInfo] = useState<{ count: number; overridden: boolean }>({
    count: 0,
    overridden: false,
  });
  const [mapInfo, setMapInfo] = useState<{ count: number; overridden: boolean }>({
    count: 0,
    overridden: false,
  });
  const [agendaDraft, setAgendaDraft] = useState<AgendaItem[]>([]);
  const [mapDraft, setMapDraft] = useState<MapPoint[]>([]);
  const [agendaNewDay, setAgendaNewDay] = useState<string>(AGENDA_DAYS[0]);
  const agendaFileRef = useRef<HTMLInputElement | null>(null);
  const mapFileRef = useRef<HTMLInputElement | null>(null);

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEventName(cfg.eventName);
    setEventTag(cfg.eventTag);
    setLandingSubtitle(cfg.landingSubtitle);
    setLogoUrl(cfg.logoUrl ?? "");
    setLogoStyle(cfg.logoStyle);
    setHomeSubtitle(cfg.homeSubtitle);
    setAgendaSubtitle(cfg.agendaSubtitle);
    setMapDescription(cfg.mapDescription);
    setMapTitle(cfg.mapTitle);
    setMapPageHeading(cfg.mapPageHeading);
    setUnlockPlaceholder(cfg.unlockPlaceholder);
    setUnlockButtonText(cfg.unlockButtonText);
    setUnlockFooterText(cfg.unlockFooterText);
    setSplashDurationMs(String(cfg.splashDurationMs ?? 2400));
    setHomeAgendaLabel(cfg.homeAgendaLabel);
    setHomeMapLabel(cfg.homeMapLabel);
    setAgendaTitle(cfg.agendaTitle);
    setAgendaDayLabel(cfg.agendaDayLabel);
  }, [
    cfg.eventName,
    cfg.eventTag,
    cfg.landingSubtitle,
    cfg.logoUrl,
    cfg.logoStyle,
    cfg.homeSubtitle,
    cfg.agendaSubtitle,
    cfg.mapDescription,
    cfg.mapTitle,
    cfg.mapPageHeading,
    cfg.unlockPlaceholder,
    cfg.unlockButtonText,
    cfg.unlockFooterText,
    cfg.splashDurationMs,
    cfg.homeAgendaLabel,
    cfg.homeMapLabel,
    cfg.agendaTitle,
    cfg.agendaDayLabel,
  ]);

  useEffect(() => {
    const run = async () => {
      const a = await fetchAgendaOverride();
      setAgendaInfo({ overridden: Boolean(a), count: a?.length ?? 0 });
      setAgendaDraft((a ?? []).map(normalizeAgendaItem));
      const m = await fetchMapOverride();
      setMapInfo({ overridden: Boolean(m), count: m?.length ?? 0 });
      setMapDraft(m ?? []);
    };
    run().catch(() => undefined);
  }, []);

  const persist = async (next: AppConfig) => {
    setSaving(true);
    setError(null);
    // Local write for instant UI
    writeConfig(next);
    // Server write so other browser contexts (Incognito) get updates via polling
    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error("PUT failed");
    } catch {
      // Don't block local usage, but inform the admin
      setError("No se pudo guardar en el servidor local. (Otros navegadores podrían no actualizarse.)");
    } finally {
      setSaving(false);
    }
  };

  const save = () => {
    const nextLogoUrl = logoUrl.trim();
    const next: AppConfig = {
      ...cfg,
      eventName: eventName.trim() || cfg.eventName,
      eventTag: eventTag.trim() || cfg.eventTag,
      landingSubtitle: landingSubtitle.trim() || cfg.landingSubtitle,
      homeSubtitle: homeSubtitle.trim(),
      homeAgendaLabel: homeAgendaLabel.trim(),
      homeMapLabel: homeMapLabel.trim(),
      agendaSubtitle: agendaSubtitle.trim(),
      logoUrl: nextLogoUrl,
      logoStyle,
      mapDescription: mapDescription.trim(),
      mapTitle: mapTitle.trim(),
      mapPageHeading: mapPageHeading.trim(),
      unlockPlaceholder: unlockPlaceholder.trim(),
      unlockButtonText: unlockButtonText.trim(),
      unlockFooterText: unlockFooterText.trim(),
      splashDurationMs: Math.min(10000, Math.max(500, Number(splashDurationMs) || 2400)),
      agendaTitle: agendaTitle.trim(),
      agendaDayLabel: agendaDayLabel.trim(),
    };
    persist(next).catch(() => undefined);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1200);
  };

  const logoPreview = useMemo(() => logoUrl.trim() || "", [logoUrl]);

  return (
    <div className="px-1">
      <Card className="p-5">
        <div className="text-[16px] font-extrabold text-zinc-900">Admin</div>
        <div className="mt-1 text-[13px] font-semibold text-zinc-600">
          Cambios locales (se guardan en este dispositivo).
        </div>

        <Tabs
          className="mt-4"
          value={tab}
          onChange={setTab}
          options={[
            { value: "branding", label: "Branding" },
            { value: "pages", label: "Páginas" },
            { value: "data", label: "Datos" },
          ]}
        />

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-white px-4 py-3 text-[13px] font-semibold text-red-700">
            {error}
          </div>
        ) : null}

        {tab === "branding" ? (
          <div className="mt-5 grid gap-4">
            <div className="flex items-center gap-4">
              <EventLogo
                logoUrl={logoPreview}
                size={72}
                frame={logoStyle !== "plain"}
                className={logoStyle !== "plain" ? "rounded-full" : ""}
              />
              <div className="flex-1">
                <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                  Logo
                </div>
                <div className="mt-1 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-2xl bg-white px-4 text-[13px] font-semibold text-zinc-900 ring-1 ring-border hover:bg-zinc-50 active:bg-zinc-100"
                    onClick={() => logoFileRef.current?.click()}
                  >
                    Subir imagen
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-2xl bg-white px-4 text-[13px] font-semibold text-zinc-900 ring-1 ring-border hover:bg-zinc-50 active:bg-zinc-100"
                    onClick={() => setLogoUrl("")}
                  >
                    Quitar
                  </button>
                </div>
                <input
                  ref={logoFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const inputEl = e.currentTarget;
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const ext =
                        file.name.split(".").pop()?.toLowerCase() ||
                        (file.type.includes("png")
                          ? "png"
                          : file.type.includes("jpeg")
                            ? "jpg"
                            : "png");
                      const url = await uploadAsset(file, `branding/logo.${ext}`);
                      setLogoUrl(url);
                    } catch {
                      setError("No se pudo leer la imagen.");
                    } finally {
                      inputEl.value = "";
                    }
                  }}
                />
              </div>
            </div>

            <label className="text-[13px] font-semibold text-zinc-900">
              Estilo del logo
              <select
                className="mt-2 h-12 w-full rounded-2xl border border-border bg-white px-4 text-[14px] font-semibold text-zinc-900 outline-none"
                value={logoStyle}
                onChange={(e) => setLogoStyle(e.target.value as AppConfig["logoStyle"])}
              >
                <option value="plain">Solo logo (sin círculo)</option>
                <option value="framed">Con marco</option>
              </select>
            </label>

            <Input
              label="Nombre del evento"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
            <Input
              label="Tag lineal"
              value={eventTag}
              onChange={(e) => setEventTag(e.target.value)}
            />
            <Input
              label="Subtítulo (Home)"
              value={homeSubtitle}
              onChange={(e) => setHomeSubtitle(e.target.value)}
            />
            <Input
              label="Subtítulo (Agenda)"
              value={agendaSubtitle}
              onChange={(e) => setAgendaSubtitle(e.target.value)}
            />
            <Input
              label="Subtítulo (Landing / otros)"
              value={landingSubtitle}
              onChange={(e) => setLandingSubtitle(e.target.value)}
            />

            <div className="pt-1 grid gap-2">
              <PrimaryButton onClick={save}>{saved ? "Guardado" : "Guardar cambios"}</PrimaryButton>
              <button
                type="button"
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-white text-zinc-900 font-semibold ring-1 ring-border hover:bg-zinc-50 active:bg-zinc-100"
                onClick={() => {
                  persist(DEFAULT_CONFIG).catch(() => undefined);
                  setSaved(true);
                  window.setTimeout(() => setSaved(false), 1200);
                }}
              >
                Reset a default
              </button>
            </div>
          </div>
        ) : tab === "pages" ? (
          <div className="mt-5 grid gap-4">
            <Card className="p-4">
              <div className="text-[13px] font-extrabold text-zinc-900">Editor por página</div>
              <div className="mt-3 grid gap-4">
                <label className="text-[12px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                  Página
                  <select
                    className="mt-2 h-12 w-full rounded-2xl border border-border bg-white px-4 text-[14px] font-semibold text-zinc-900 outline-none"
                    value={pageKey}
                    onChange={(e) => {
                      const v = e.target.value as PageKey;
                      setPageKey(v);
                      if (v !== "global") setBgKey(v);
                    }}
                  >
                    <option value="global">Global</option>
                    <option value="splash">Splash</option>
                    <option value="unlock">Unlock</option>
                    <option value="home">Home</option>
                    <option value="agenda">Agenda</option>
                    <option value="agendaDetail">Agenda detalle</option>
                    <option value="mapa">Mapa</option>
                    <option value="admin">Admin</option>
                  </select>
                </label>

                {pageKey !== "global" ? (
                  <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                    <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                      Background
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="inline-flex h-10 items-center justify-center rounded-2xl bg-white px-4 text-[13px] font-semibold text-zinc-900 ring-1 ring-border hover:bg-zinc-50 active:bg-zinc-100"
                        onClick={() => bgFileRef.current?.click()}
                      >
                        Subir background
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-10 items-center justify-center rounded-2xl bg-white px-4 text-[13px] font-semibold text-zinc-900 ring-1 ring-border hover:bg-zinc-50 active:bg-zinc-100"
                        onClick={() => {
                          persist({
                            ...cfg,
                            backgrounds: { ...cfg.backgrounds, [bgKey]: "" },
                          }).catch(() => undefined);
                          setSaved(true);
                          window.setTimeout(() => setSaved(false), 900);
                        }}
                      >
                        Quitar
                      </button>
                    </div>

                    <input
                      ref={bgFileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                    const inputEl = e.currentTarget;
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const ext =
                            file.name.split(".").pop()?.toLowerCase() ||
                            (file.type.includes("png")
                              ? "png"
                              : file.type.includes("jpeg")
                                ? "jpg"
                                : "png");
                          const dataUrl = await uploadAsset(file, `backgrounds/${bgKey}.${ext}`);
                          await persist({
                            ...cfg,
                            backgrounds: { ...cfg.backgrounds, [bgKey]: dataUrl },
                          });
                          setSaved(true);
                          window.setTimeout(() => setSaved(false), 900);
                        } catch {
                          setError("No se pudo leer el background.");
                        } finally {
                      inputEl.value = "";
                        }
                      }}
                    />

                    <div className="mt-2 text-[12px] font-semibold text-zinc-600">
                      {cfg.backgrounds?.[bgKey] ? "Background cargado ✅" : "Sin background (usa default)"}
                    </div>
                  </div>
                ) : null}

                {/* Page-specific fields */}
                {pageKey === "global" ? (
                  <div className="grid gap-4">
                    <Input
                      label="Nombre del evento"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                    />
                    <Input
                      label="Tag lineal"
                      value={eventTag}
                      onChange={(e) => setEventTag(e.target.value)}
                    />
                  </div>
                ) : null}

                {pageKey === "splash" ? (
                  <div className="grid gap-4">
                    <Input
                      label="Duración Splash (ms)"
                      value={splashDurationMs}
                      onChange={(e) => setSplashDurationMs(e.target.value)}
                      inputMode="numeric"
                      hint="Mín 500 · Máx 10000"
                    />
                  </div>
                ) : null}

                {pageKey === "unlock" ? (
                  <div className="grid gap-4">
                    <Input
                      label="Placeholder"
                      value={unlockPlaceholder}
                      onChange={(e) => setUnlockPlaceholder(e.target.value)}
                    />
                    <Input
                      label="Texto botón"
                      value={unlockButtonText}
                      onChange={(e) => setUnlockButtonText(e.target.value)}
                    />
                    <Input
                      label="Texto pie"
                      value={unlockFooterText}
                      onChange={(e) => setUnlockFooterText(e.target.value)}
                    />
                  </div>
                ) : null}

                {pageKey === "home" ? (
                  <div className="grid gap-4">
                    <Input
                      label="Subtítulo"
                      value={homeSubtitle}
                      onChange={(e) => setHomeSubtitle(e.target.value)}
                    />
                    <Input
                      label="Botón Agenda"
                      value={homeAgendaLabel}
                      onChange={(e) => setHomeAgendaLabel(e.target.value)}
                    />
                    <Input
                      label="Botón Mapa"
                      value={homeMapLabel}
                      onChange={(e) => setHomeMapLabel(e.target.value)}
                    />
                  </div>
                ) : null}

                {pageKey === "agenda" ? (
                  <div className="grid gap-4">
                    <Input
                      label="Título"
                      value={agendaTitle}
                      onChange={(e) => setAgendaTitle(e.target.value)}
                    />
                    <Input
                      label="Día (label)"
                      value={agendaDayLabel}
                      onChange={(e) => setAgendaDayLabel(e.target.value)}
                    />
                    <Input
                      label="Subtítulo"
                      value={agendaSubtitle}
                      onChange={(e) => setAgendaSubtitle(e.target.value)}
                    />
                  </div>
                ) : null}

                {pageKey === "mapa" ? (
                  <div className="grid gap-4">
                    <Input
                      label="Heading (grande)"
                      value={mapPageHeading}
                      onChange={(e) => setMapPageHeading(e.target.value)}
                    />
                    <label className="text-[13px] font-semibold text-zinc-900">
                      Descripción
                      <textarea
                        className="mt-2 min-h-[96px] w-full resize-y rounded-2xl border border-border bg-white px-4 py-3 text-[14px] text-zinc-900 shadow-sm outline-none"
                        value={mapDescription}
                        onChange={(e) => setMapDescription(e.target.value)}
                      />
                    </label>
                  </div>
                ) : null}

                <PrimaryButton onClick={save} isLoading={saving}>
                  {saved ? "Guardado" : "Guardar cambios"}
                </PrimaryButton>
              </div>
            </Card>
          </div>
        ) : (
          <div className="mt-5 grid gap-4">
            <Card className="p-4">
              <div className="text-[13px] font-extrabold text-zinc-900">Agenda</div>
              <div className="mt-1 text-[13px] font-semibold text-zinc-600">
                Override local: {agendaInfo.overridden ? `${agendaInfo.count} items` : "no"}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-white px-4 text-[13px] font-semibold text-zinc-900 ring-1 ring-border hover:bg-zinc-50 active:bg-zinc-100"
                  onClick={() => agendaFileRef.current?.click()}
                >
                  Subir agenda.json
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-white px-4 text-[13px] font-semibold text-zinc-900 ring-1 ring-border hover:bg-zinc-50 active:bg-zinc-100"
                  onClick={() => downloadJson("agenda.override.json", agendaDraft)}
                  disabled={!agendaInfo.overridden}
                >
                  Descargar override
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-white px-4 text-[13px] font-semibold text-zinc-900 ring-1 ring-border hover:bg-zinc-50 active:bg-zinc-100"
                  onClick={async () => {
                    await clearAgendaOverride();
                    setAgendaInfo({ overridden: false, count: 0 });
                    setAgendaDraft([]);
                  }}
                  disabled={!agendaInfo.overridden}
                >
                  Quitar override
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-brand-600 px-4 text-[13px] font-semibold text-white shadow-sm hover:bg-brand-700 active:bg-brand-800"
                  onClick={async () => {
                    await saveAgendaOverride(agendaDraft);
                    setAgendaInfo({ overridden: true, count: agendaDraft.length });
                  }}
                  disabled={!agendaDraft.length}
                >
                  Guardar manual
                </button>
              </div>

              {/* Manual editor */}
              <div className="mt-4 grid gap-3">
                {agendaDraft.map((it, idx) => (
                  <div key={`${it.id}-${idx}`} className="rounded-2xl border border-border bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[13px] font-extrabold text-zinc-900">{it.title || "Evento"}</div>
                      <button
                        type="button"
                        className="rounded-xl px-3 py-2 text-[12px] font-semibold text-zinc-700 hover:bg-zinc-900/5 active:bg-zinc-900/10"
                        onClick={() => setAgendaDraft((cur) => cur.filter((_, i) => i !== idx))}
                      >
                        Eliminar
                      </button>
                    </div>
                    <div className="mt-3 grid gap-3">
                      <Input label="ID" value={it.id} onChange={(e) => setAgendaDraft((cur) => cur.map((x, i) => (i === idx ? { ...x, id: e.target.value } : x)))} />
                      <Input label="Título" value={it.title} onChange={(e) => setAgendaDraft((cur) => cur.map((x, i) => (i === idx ? { ...x, title: e.target.value } : x)))} />
                      <div className="grid grid-cols-2 gap-3">
                        <Input label="Inicio" value={it.startTime} onChange={(e) => setAgendaDraft((cur) => cur.map((x, i) => (i === idx ? { ...x, startTime: e.target.value } : x)))} />
                        <Input label="Fin" value={it.endTime} onChange={(e) => setAgendaDraft((cur) => cur.map((x, i) => (i === idx ? { ...x, endTime: e.target.value } : x)))} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="text-[13px] font-semibold text-zinc-900">
                          Día
                          <select
                            className="mt-2 h-12 w-full rounded-2xl border border-border bg-white px-4 text-[14px] font-semibold text-zinc-900 outline-none"
                            value={(AGENDA_DAYS as readonly string[]).includes(it.day) ? it.day : AGENDA_DAYS[0]}
                            onChange={(e) =>
                              setAgendaDraft((cur) =>
                                cur.map((x, i) =>
                                  i === idx ? normalizeAgendaItem({ ...x, day: e.target.value }) : x,
                                ),
                              )
                            }
                          >
                            {AGENDA_DAYS.map((d) => (
                              <option key={d} value={d}>
                                {formatDayShort(d)}
                              </option>
                            ))}
                          </select>
                        </label>
                        <Input label="Salón" value={it.location} onChange={(e) => setAgendaDraft((cur) => cur.map((x, i) => (i === idx ? { ...x, location: e.target.value } : x)))} />
                      </div>
                      <label className="text-[13px] font-semibold text-zinc-900">
                        Descripción
                        <textarea
                          className="mt-2 min-h-[90px] w-full resize-y rounded-2xl border border-border bg-white px-4 py-3 text-[14px] text-zinc-900 shadow-sm outline-none"
                          value={it.description}
                          onChange={(e) => setAgendaDraft((cur) => cur.map((x, i) => (i === idx ? { ...x, description: e.target.value } : x)))}
                        />
                      </label>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-white text-zinc-900 font-semibold ring-1 ring-border hover:bg-zinc-50 active:bg-zinc-100"
                  onClick={() =>
                    setAgendaDraft((cur) => [
                      ...cur,
                      normalizeAgendaItem({
                        id: `evento-${agendaNewDay}-${cur.length + 1}`,
                        title: "",
                        startTime: "09:00",
                        endTime: "09:30",
                        day: agendaNewDay,
                        track: "Otros",
                        location: "",
                        description: "",
                      }),
                    ])
                  }
                >
                  + Agregar evento
                </button>

                <label className="text-[13px] font-semibold text-zinc-900">
                  Día para nuevo evento
                  <select
                    className="mt-2 h-12 w-full rounded-2xl border border-border bg-white px-4 text-[14px] font-semibold text-zinc-900 outline-none"
                    value={agendaNewDay}
                    onChange={(e) => setAgendaNewDay(e.target.value)}
                  >
                    {AGENDA_DAYS.map((d) => (
                      <option key={d} value={d}>
                        {formatDayShort(d)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <input
                ref={agendaFileRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={async (e) => {
                  const inputEl = e.currentTarget;
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const raw = await file.text();
                    const parsed = JSON.parse(raw);
                    if (!Array.isArray(parsed) || !parsed.every(isAgendaItem)) {
                      setError("agenda.json inválido (estructura inesperada).");
                      return;
                    }
                    const normalized = (parsed as AgendaItem[]).map(normalizeAgendaItem);
                    await saveAgendaOverride(normalized);
                    setAgendaDraft(normalized);
                    setAgendaInfo({ overridden: true, count: normalized.length });
                    setError(null);
                  } catch {
                    setError("No se pudo leer agenda.json.");
                  } finally {
                    inputEl.value = "";
                  }
                }}
              />
            </Card>

            <Card className="p-4">
              <div className="text-[13px] font-extrabold text-zinc-900">Mapa</div>
              <div className="mt-1 text-[13px] font-semibold text-zinc-600">
                Override local: {mapInfo.overridden ? `${mapInfo.count} puntos` : "no"}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-white px-4 text-[13px] font-semibold text-zinc-900 ring-1 ring-border hover:bg-zinc-50 active:bg-zinc-100"
                  onClick={() => mapFileRef.current?.click()}
                >
                  Subir mapa.json
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-white px-4 text-[13px] font-semibold text-zinc-900 ring-1 ring-border hover:bg-zinc-50 active:bg-zinc-100"
                  onClick={() => downloadJson("mapa.override.json", mapDraft)}
                  disabled={!mapInfo.overridden}
                >
                  Descargar override
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-white px-4 text-[13px] font-semibold text-zinc-900 ring-1 ring-border hover:bg-zinc-50 active:bg-zinc-100"
                  onClick={async () => {
                    await clearMapOverride();
                    setMapInfo({ overridden: false, count: 0 });
                    setMapDraft([]);
                  }}
                  disabled={!mapInfo.overridden}
                >
                  Quitar override
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-brand-600 px-4 text-[13px] font-semibold text-white shadow-sm hover:bg-brand-700 active:bg-brand-800"
                  onClick={async () => {
                    await saveMapOverride(mapDraft);
                    setMapInfo({ overridden: true, count: mapDraft.length });
                  }}
                  disabled={!mapDraft.length}
                >
                  Guardar manual
                </button>
              </div>

              {/* Manual editor */}
              <div className="mt-4 grid gap-3">
                {mapDraft.map((p, idx) => (
                  <div key={`${p.id}-${idx}`} className="rounded-2xl border border-border bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[13px] font-extrabold text-zinc-900">{p.title || "Punto"}</div>
                      <button
                        type="button"
                        className="rounded-xl px-3 py-2 text-[12px] font-semibold text-zinc-700 hover:bg-zinc-900/5 active:bg-zinc-900/10"
                        onClick={() => setMapDraft((cur) => cur.filter((_, i) => i !== idx))}
                      >
                        Eliminar
                      </button>
                    </div>
                    <div className="mt-3 grid gap-3">
                      <Input label="ID" value={p.id} onChange={(e) => setMapDraft((cur) => cur.map((x, i) => (i === idx ? { ...x, id: e.target.value } : x)))} />
                      <Input label="Título" value={p.title} onChange={(e) => setMapDraft((cur) => cur.map((x, i) => (i === idx ? { ...x, title: e.target.value } : x)))} />
                      <label className="text-[13px] font-semibold text-zinc-900">
                        Tipo
                        <select
                          className="mt-2 h-12 w-full rounded-2xl border border-border bg-white px-4 text-[14px] font-semibold text-zinc-900 outline-none"
                          value={p.type}
                          onChange={(e) => setMapDraft((cur) => cur.map((x, i) => (i === idx ? { ...x, type: e.target.value as MapPoint["type"] } : x)))}
                        >
                          <option value="zona">zona</option>
                          <option value="encuentro">encuentro</option>
                          <option value="salon-break">salon-break</option>
                        </select>
                      </label>
                      <label className="text-[13px] font-semibold text-zinc-900">
                        Descripción
                        <textarea
                          className="mt-2 min-h-[90px] w-full resize-y rounded-2xl border border-border bg-white px-4 py-3 text-[14px] text-zinc-900 shadow-sm outline-none"
                          value={p.description}
                          onChange={(e) => setMapDraft((cur) => cur.map((x, i) => (i === idx ? { ...x, description: e.target.value } : x)))}
                        />
                      </label>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-white text-zinc-900 font-semibold ring-1 ring-border hover:bg-zinc-50 active:bg-zinc-100"
                  onClick={() =>
                    setMapDraft((cur) => [
                      ...cur,
                      { id: `punto-${cur.length + 1}`, type: "zona", title: "", description: "" },
                    ])
                  }
                >
                  + Agregar punto
                </button>
              </div>

              <input
                ref={mapFileRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={async (e) => {
                  const inputEl = e.currentTarget;
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const raw = await file.text();
                    const parsed = JSON.parse(raw);
                    if (!Array.isArray(parsed) || !parsed.every(isMapPoint)) {
                      setError("mapa.json inválido (estructura inesperada).");
                      return;
                    }
                    await saveMapOverride(parsed as MapPoint[]);
                    setMapDraft(parsed as MapPoint[]);
                    setMapInfo({ overridden: true, count: (parsed as MapPoint[]).length });
                    setError(null);
                  } catch {
                    setError("No se pudo leer mapa.json.");
                  } finally {
                    inputEl.value = "";
                  }
                }}
              />
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
}

