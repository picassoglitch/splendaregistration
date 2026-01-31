"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAppBaseUrl } from "@/lib/url";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export async function loginAction(input: { email: string; password: string }) {
  const email = input.email.trim();
  const password = input.password;
  if (!email || !isValidEmail(email)) return { ok: false as const, error: "Correo inválido." };
  if (!password) return { ok: false as const, error: "Ingresa tu contraseña." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false as const, error: "No pudimos iniciar sesión. Revisa tus datos." };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const confirmed = Boolean(
    (user as { email_confirmed_at?: string | null; confirmed_at?: string | null } | null)
      ?.email_confirmed_at ||
      (user as { email_confirmed_at?: string | null; confirmed_at?: string | null } | null)
        ?.confirmed_at,
  );

  if (!confirmed) {
    await supabase.auth.signOut();
    return { ok: false as const, error: "Tu correo no está confirmado. Revisa tu bandeja de entrada." };
  }

  return { ok: true as const };
}

export async function registerAction(input: {
  fullName: string;
  email: string;
  password: string;
}) {
  const fullName = input.fullName.trim();
  const email = input.email.trim();
  const password = input.password;

  if (!fullName) return { ok: false as const, error: "Ingresa tu nombre." };
  if (!email || !isValidEmail(email)) return { ok: false as const, error: "Correo inválido." };
  if (!password) return { ok: false as const, error: "Ingresa una contraseña." };

  const supabase = await createSupabaseServerClient();
  const emailRedirectTo = `${getAppBaseUrl()}/auth/callback`;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName }, emailRedirectTo },
  });
  if (error) {
    return {
      ok: false as const,
      error: "No pudimos registrarte. Verifica el correo o intenta más tarde.",
    };
  }

  // Always force returning to login after registration.
  if (data.session) {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }

  return { ok: true as const, email };
}

