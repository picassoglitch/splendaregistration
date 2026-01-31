"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { registerAction } from "@/app/actions/auth";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const submit = async () => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = "Ingresa tu nombre.";
    if (!email.trim()) nextErrors.email = "Ingresa tu correo.";
    else if (!isValidEmail(email)) nextErrors.email = "Correo inválido.";
    if (!password) nextErrors.password = "Ingresa una contraseña.";
    if (!confirm) nextErrors.confirm = "Confirma tu contraseña.";
    if (password && confirm && password !== confirm) {
      nextErrors.confirm = "Las contraseñas no coinciden.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    startTransition(async () => {
      const res = await registerAction({
        fullName: name,
        email,
        password,
      });
      if (!res.ok) {
        setErrors({ email: res.error });
        return;
      }
      router.push(`/success?email=${encodeURIComponent(res.email ?? email.trim())}`);
    });
  };

  return (
    <div className="min-h-dvh px-1 pb-10 pt-[max(24px,var(--sat))]">
      <div className="page-in mx-auto flex min-h-[calc(100dvh-24px)] flex-col items-center justify-center">
        <div className="mb-6 flex w-full flex-col items-center">
          <div className="h-20 w-20 rounded-full bg-brand-600/15 ring-1 ring-brand-200 flex items-center justify-center">
            <div className="h-9 w-9 rounded-full bg-white ring-1 ring-border" />
          </div>
        </div>

        <div className="w-full max-w-[420px]">
          <div className="grid gap-4">
            <Input
              label="Nombre"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              error={errors.name}
            />
            <Input
              label="Mail"
              placeholder="Mail"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              error={errors.email}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              error={errors.password}
            />
            <Input
              label="Confirm password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              error={errors.confirm}
            />

            <div className="pt-2">
              <PrimaryButton onClick={submit} isLoading={isPending} size="md">
                Registrarse
              </PrimaryButton>
            </div>

            <div className="text-center text-[13px] font-semibold text-zinc-600">
              <Link className="text-brand-700 hover:underline" href="/">
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

