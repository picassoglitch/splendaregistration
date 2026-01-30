import Link from "next/link";

export function SupportFooter() {
  return (
    <footer className="mt-8 border-t border-border pb-6 pt-5">
      <div className="grid gap-3">
        <Link
          className="text-center text-[13px] font-semibold text-zinc-600 hover:text-zinc-900"
          href="/privacidad"
        >
          Aviso de privacidad
        </Link>
      </div>
    </footer>
  );
}

