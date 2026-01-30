import Link from "next/link";
import { CheckCircle2, MailCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { PrimaryLinkButton } from "@/components/ui/PrimaryButton";

export const metadata = {
  title: "Registro exitoso",
};

export default function SuccessPage({
  searchParams,
}: {
  searchParams?: { email?: string };
}) {
  const email = searchParams?.email;
  return (
    <div className="min-h-dvh px-1 pb-8 pt-[max(22px,var(--sat))]">
      <div className="page-in">
        <Card className="p-6">
          <div className="flex items-center justify-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600/15 ring-1 ring-brand-200">
              {email ? (
                <MailCheck className="h-7 w-7 text-brand-700" />
              ) : (
                <CheckCircle2 className="h-7 w-7 text-brand-700" />
              )}
            </div>
          </div>
          <div className="mt-4 text-center text-[18px] font-extrabold text-zinc-900">
            {email ? "Confirma tu correo" : "Registro exitoso"}
          </div>
          <div className="mt-2 text-center text-[13px] font-semibold text-zinc-600">
            {email
              ? `Te enviamos un enlace de confirmación a ${email}. Abre tu correo, confirma y vuelve a iniciar sesión.`
              : "Listo. Ya puedes navegar Agenda y Mapa."}
          </div>

          <div className="mt-6 grid gap-3">
            {email ? (
              <PrimaryLinkButton href="/">Ir a iniciar sesión</PrimaryLinkButton>
            ) : (
              <PrimaryLinkButton href="/home">Continuar</PrimaryLinkButton>
            )}
            <Link
              href="/"
              className="text-center text-[13px] font-semibold text-zinc-600 hover:text-zinc-900"
            >
              Volver al inicio
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

