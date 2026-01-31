"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

type Role = "user" | "admin" | "super_admin";

type UserRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: Role;
  created_at: string | null;
  updated_at: string | null;
};

export function UsersAdmin({ canEditRoles }: { canEditRoles: boolean }) {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      if (!res.ok) {
        setError("No se pudieron cargar usuarios.");
        setUsers([]);
        return;
      }
      const json = (await res.json()) as { users?: UserRow[] };
      setUsers(json.users ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(() => undefined);
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;
    return users.filter((u) => {
      const email = (u.email ?? "").toLowerCase();
      const name = (u.full_name ?? "").toLowerCase();
      return email.includes(s) || name.includes(s) || u.id.toLowerCase().includes(s);
    });
  }, [q, users]);

  const updateRole = async (id: string, role: Role) => {
    if (!canEditRoles) return;
    setSavingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        setError("No se pudo actualizar el rol.");
        return;
      }
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="grid gap-4">
      <Card className="p-4">
        <div className="text-[14px] font-extrabold text-zinc-900">Usuarios</div>
        <div className="mt-1 text-[13px] font-semibold text-zinc-600">
          Busca por email/nombre y exporta datos. {canEditRoles ? "También puedes actualizar el rol." : "El rol solo lo puede cambiar un super admin."}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <Input
            label="Buscar"
            placeholder="email, nombre o id…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <PrimaryButton variant="secondary" size="md" onClick={load}>
            Recargar
          </PrimaryButton>
        </div>

        {error ? (
          <div className="mt-3 rounded-2xl border border-red-200 bg-white px-4 py-3 text-[13px] font-semibold text-red-700">
            {error}
          </div>
        ) : null}
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-4 text-[13px] font-semibold text-zinc-600">Cargando…</div>
        ) : filtered.length ? (
          <div className="divide-y divide-border">
            {filtered.map((u) => (
              <div key={u.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-extrabold text-zinc-900">
                      {u.full_name || "—"}
                    </div>
                    <div className="mt-0.5 truncate text-[12px] font-semibold text-zinc-600">
                      {u.email || "—"}
                    </div>
                    <div className="mt-1 truncate text-[11px] font-semibold text-zinc-400">
                      {u.id}
                    </div>
                  </div>

                  <div className="shrink-0">
                    <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                      Rol
                    </label>
                    <select
                      className="mt-2 h-10 rounded-2xl border border-border bg-white px-3 text-[13px] font-semibold text-zinc-900 shadow-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-200/55"
                      value={u.role}
                      disabled={!canEditRoles || savingId === u.id}
                      onChange={(e) => updateRole(u.id, e.target.value as Role)}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                      <option value="super_admin">super_admin</option>
                    </select>
                    {savingId === u.id ? (
                      <div className="mt-2 text-right text-[11px] font-semibold text-zinc-500">
                        Guardando…
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-[13px] font-semibold text-zinc-600">
            No hay usuarios.
          </div>
        )}
      </Card>

      <Card className="p-4">
        <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-zinc-500">
          Export
        </div>
        <div className="mt-2 text-[13px] font-semibold text-zinc-600">
          Descargar CSV:
        </div>
        <div className="mt-3">
          <a
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-white text-zinc-900 font-semibold ring-1 ring-border hover:bg-zinc-50 active:bg-zinc-100"
            href="/api/admin/users?format=csv"
            target="_blank"
            rel="noreferrer"
          >
            Descargar users.csv
          </a>
        </div>
      </Card>
    </div>
  );
}

