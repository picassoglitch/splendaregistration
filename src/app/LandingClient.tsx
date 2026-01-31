"use client";

import { useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";

export function LandingClient() {
  const sp = useSearchParams();
  const confirmed = sp.get("confirmed") === "1";
  const authErrorCode = sp.get("authErrorCode");
  const authErrorDescription = sp.get("authErrorDescription");

  return (
    <>
      {confirmed ? (
        <div className="mb-3 rounded-2xl border border-border bg-white px-4 py-3 text-[13px] font-semibold text-zinc-700">
          Correo confirmado. Ya puedes iniciar sesión.
        </div>
      ) : null}
      {authErrorCode || authErrorDescription ? (
        <div className="mb-3 rounded-2xl border border-red-200 bg-white px-4 py-3 text-[13px] font-semibold text-red-700">
          {authErrorDescription
            ? decodeURIComponent(authErrorDescription.replaceAll("+", " "))
            : `Error de autenticación (${authErrorCode}).`}
        </div>
      ) : null}

      <LoginForm />
    </>
  );
}

