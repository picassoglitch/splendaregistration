import { AgendaClient } from "@/app/(app)/agenda/ui/AgendaClient";

export const metadata = {
  title: "Agenda",
};

export default function AgendaPage() {
  return (
    <div className="px-1">
      <AgendaClient />
    </div>
  );
}

