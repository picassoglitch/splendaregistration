import { notFound } from "next/navigation";
import { Image as ImageIcon, Clock3, MapPin } from "lucide-react";
import { getAgendaItem } from "@/lib/data/agenda";
import { Card } from "@/components/ui/Card";
import { FavoriteToggle } from "@/components/agenda/FavoriteToggle";

export const metadata = {
  title: "Detalle",
};

export default function AgendaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const item = getAgendaItem(params.id);
  if (!item) return notFound();

  const time = `${item.startTime} — ${item.endTime}`;
  const paragraphs = item.description.split("\n\n");

  return (
    <div className="px-1">
      <Card className="overflow-hidden">
        <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-brand-600/20 via-white to-brand-600/10">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-3 text-zinc-900 shadow-sm ring-1 ring-border backdrop-blur">
              <ImageIcon className="h-5 w-5 text-brand-700" />
              <div className="text-[14px] font-extrabold">Imagen</div>
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="text-[18px] font-extrabold tracking-tight text-zinc-900">
            {item.title}
          </div>

          <div className="mt-3 grid gap-2 rounded-2xl bg-surface-2 p-4 ring-1 ring-border">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-zinc-700">
              <Clock3 className="h-4 w-4 text-zinc-500" />
              {time}
            </div>
            <div className="flex items-center gap-2 text-[13px] font-semibold text-zinc-700">
              <MapPin className="h-4 w-4 text-zinc-500" />
              {item.location}
            </div>
            <div className="text-[13px] font-semibold text-zinc-600">
              Categoría:{" "}
              <span className="font-extrabold text-zinc-900">{item.track}</span>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {paragraphs.map((p, idx) => (
              <p key={idx} className="text-[14px] leading-6 text-zinc-800">
                {p}
              </p>
            ))}
          </div>

          <div className="mt-6">
            <FavoriteToggle agendaId={item.id} />
          </div>
        </div>
      </Card>
    </div>
  );
}

