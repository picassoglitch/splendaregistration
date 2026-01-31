"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { loginAction } from "@/app/actions/auth";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function LoginForm({ showRegisterLink = true }: { showRegisterLink?: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const submit = async () => {
    const nextErrors: Record<string, string> = {};
    if (!email.trim()) nextErrors.email = "Ingresa tu correo.";
    else if (!isValidEmail(email)) nextErrors.email = "Correo inválido.";
    if (!password) nextErrors.password = "Ingresa tu contraseña.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    startTransition(async () => {
      const res = await loginAction({ email, password });
      if (!res.ok) {
        setErrors({ email: res.error });
        return;
      }
      // Full navigation so newly set auth cookies are definitely applied in production.
      window.location.assign("/home");
    });
  };

  return (
    <div className="w-full max-w-[420px]">
      <div className="grid gap-4">
        <Input
          label="Email"
          placeholder="correo@ejemplo.com"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          error={errors.email}
        />
        <Input
          label="Password"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          error={errors.password}
        />

        <div className="pt-2">
          <PrimaryButton onClick={submit} isLoading={isPending} size="md">
            Entrar
          </PrimaryButton>
        </div>

        {showRegisterLink ? (
          <div className="text-center text-[13px] font-semibold text-zinc-600">
            <Link className="text-brand-700 hover:underline" href="/register">
              Registrarse
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

