"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Tabs } from "@/components/ui/Tabs";

type Track = "Plenario" | "Expositores" | "Otros";

type AgendaRow = {
  id: string;
  title: string;
  day: string;
  start_time: string;
  end_time: string;
  track: Track;
  location: string;
  description: string;
};

export function AgendaAdmin() {
  const [items, setItems] = useState<AgendaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Track>("Plenario");
  const [editing, setEditing] = useState<AgendaRow | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/agenda", { cache: "no-store" });
      const json = (await res.json()) as { items?: AgendaRow[] };
      setItems(json.items ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(() => undefined);
  }, []);

  const filtered = useMemo(
    () => items.filter((x) => x.track === filter),
    [items, filter],
  );

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = isNew
        ? await fetch(`/api/admin/agenda`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(editing),
          })
        : await fetch(`/api/admin/agenda/${editing.id}`, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(editing),
          });
      if (!res.ok) throw new Error("save failed");
      await load();
      setEditing(null);
      setIsNew(false);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!editing || isNew) return;
    const ok = confirm("¿Eliminar este evento? Esta acción no se puede deshacer.");
    if (!ok) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/agenda/${editing.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete failed");
      await load();
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const newItem = () => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `evt-${Date.now()}`;
    const today = new Date().toISOString().slice(0, 10);
    setEditing({
      id,
      title: "",
      day: today,
      start_time: "09:00",
      end_time: "09:30",
      track: filter,
      location: "",
      description: "",
    });
    setIsNew(true);
  };

  return (
    <div className="grid gap-4">
      <Card className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[14px] font-extrabold text-zinc-900">Agenda</div>
            <div className="mt-1 text-[13px] font-semibold text-zinc-600">
              Edita sesiones y categorías: Plenario / Expositores / Otros.
            </div>
          </div>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-2xl bg-brand-600 px-4 text-[13px] font-extrabold text-white shadow-sm hover:bg-brand-700 active:bg-brand-800"
            onClick={newItem}
          >
            Nuevo
          </button>
        </div>
        <div className="mt-4">
          <Tabs
            value={filter}
            onChange={setFilter}
            options={[
              { value: "Plenario", label: "Plenario" },
              { value: "Expositores", label: "Expositores" },
              { value: "Otros", label: "Otros" },
            ]}
          />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="divide-y divide-border">
          {loading ? (
            <div className="p-4 text-[13px] font-semibold text-zinc-600">
              Cargando…
            </div>
          ) : filtered.length ? (
            filtered.map((x) => (
              <button
                key={x.id}
                type="button"
                className="w-full px-4 py-3 text-left hover:bg-zinc-50 active:bg-zinc-100"
                onClick={() => setEditing({ ...x })}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-extrabold text-zinc-900">
                      {x.start_time} · {x.title}
                    </div>
                    <div className="mt-0.5 text-[12px] font-semibold text-zinc-600">
                      {x.location} · {x.day}
                    </div>
                  </div>
                  <div className="text-[12px] font-bold text-brand-700">Editar</div>
                </div>
              </button>
            ))
          ) : (
            <div className="p-4 text-[13px] font-semibold text-zinc-600">
              No hay eventos en esta categoría.
            </div>
          )}
        </div>
      </Card>

      {editing ? (
        <Card className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[14px] font-extrabold text-zinc-900">
              {isNew ? "Nuevo evento" : "Editar evento"}
            </div>
            <button
              type="button"
              className="rounded-xl px-3 py-2 text-[13px] font-semibold text-zinc-600 hover:bg-zinc-900/5"
              onClick={() => {
                setEditing(null);
                setIsNew(false);
              }}
            >
              Cerrar
            </button>
          </div>

          <div className="mt-4 grid gap-3">
            <Input
              label="Título"
              value={editing.title}
              onChange={(e) => setEditing((p) => (p ? { ...p, title: e.target.value } : p))}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Inicio"
                value={editing.start_time}
                onChange={(e) =>
                  setEditing((p) => (p ? { ...p, start_time: e.target.value } : p))
                }
              />
              <Input
                label="Fin"
                value={editing.end_time}
                onChange={(e) =>
                  setEditing((p) => (p ? { ...p, end_time: e.target.value } : p))
                }
              />
            </div>
            <Input
              label="Día (YYYY-MM-DD)"
              value={editing.day}
              onChange={(e) => setEditing((p) => (p ? { ...p, day: e.target.value } : p))}
            />
            <Input
              label="Ubicación"
              value={editing.location}
              onChange={(e) =>
                setEditing((p) => (p ? { ...p, location: e.target.value } : p))
              }
            />
            <div className="rounded-2xl border border-border bg-surface-2 p-4">
              <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                Categoría
              </div>
              <div className="mt-3">
                <Tabs
                  value={editing.track}
                  onChange={(v) => setEditing((p) => (p ? { ...p, track: v as Track } : p))}
                  options={[
                    { value: "Plenario", label: "Plenario" },
                    { value: "Expositores", label: "Expositores" },
                    { value: "Otros", label: "Otros" },
                  ]}
                />
              </div>
            </div>
            <textarea
              className="min-h-[140px] w-full rounded-2xl border border-border bg-white px-4 py-3 text-[14px] text-zinc-800 shadow-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-200/55"
              value={editing.description}
              onChange={(e) =>
                setEditing((p) => (p ? { ...p, description: e.target.value } : p))
              }
            />

            <div className="grid gap-2 sm:grid-cols-2">
              <PrimaryButton onClick={save} isLoading={saving}>
                {isNew ? "Crear" : "Guardar"}
              </PrimaryButton>
              {isNew ? (
                <PrimaryButton variant="secondary" onClick={load}>
                  Recargar
                </PrimaryButton>
              ) : (
                <PrimaryButton variant="secondary" onClick={remove} isLoading={saving}>
                  Eliminar
                </PrimaryButton>
              )}
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

