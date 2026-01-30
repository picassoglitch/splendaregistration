"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useAuth } from "@/components/auth/AuthProvider";
import { getSupabaseClient } from "@/lib/supabase/client";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function LoginForm({ showRegisterLink = true }: { showRegisterLink?: boolean }) {
  const router = useRouter();
  const { supabaseEnabled } = useAuth();
  const supabase = useMemo(() => getSupabaseClient(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const nextErrors: Record<string, string> = {};
    if (!supabaseEnabled || !supabase) {
      nextErrors.email = "Supabase no está configurado (faltan variables de entorno).";
    }
    if (!email.trim()) nextErrors.email = "Ingresa tu correo.";
    else if (!isValidEmail(email)) nextErrors.email = "Correo inválido.";
    if (!password) nextErrors.password = "Ingresa tu contraseña.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      const { error } = await supabase!.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setErrors({ password: "No pudimos iniciar sesión. Revisa tus datos." });
        return;
      }
      router.push("/home");
    } finally {
      setLoading(false);
    }
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
          <PrimaryButton onClick={submit} isLoading={loading} size="md">
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

