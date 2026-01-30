import { PublicTopBar } from "@/components/shell/PublicTopBar";
import { PrivacyClient } from "@/components/privacy/PrivacyClient";

export const metadata = {
  title: "Aviso de privacidad",
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-dvh">
      <PublicTopBar title="Aviso Privacidad" />
      <div className="page-in px-1 pb-8 pt-4">
        <PrivacyClient />
      </div>
    </div>
  );
}

