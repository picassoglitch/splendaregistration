import { getAgendaItems } from "@/lib/data/agenda";
import { AgendaList } from "@/components/agenda/AgendaList";

export const metadata = {
  title: "Agenda",
};

export default function AgendaPage() {
  const items = getAgendaItems();
  return (
    <div className="px-1">
      <AgendaList items={items} />
    </div>
  );
}

