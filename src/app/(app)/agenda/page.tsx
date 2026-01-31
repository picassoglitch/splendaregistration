import { getAgendaItems } from "@/lib/data/agenda";
import { getAgendaItemsSupabase } from "@/lib/data/agendaSupabase";
import { AgendaList } from "@/components/agenda/AgendaList";

export const metadata = {
  title: "Agenda",
};

export default async function AgendaPage() {
  const db = await getAgendaItemsSupabase();
  const items = db ?? getAgendaItems();
  return (
    <div className="px-1">
      <AgendaList items={items} />
    </div>
  );
}

