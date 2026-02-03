import { AgendaDetailClient } from "@/app/(app)/agenda/[id]/ui/AgendaDetailClient";

export const metadata = {
  title: "Detalle",
};

export default async function AgendaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <AgendaDetailClient id={params.id} />;
}

