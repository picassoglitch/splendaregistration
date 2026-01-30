import { getMapPoints } from "@/lib/data/mapa";
import { MapaView } from "@/components/mapa/MapaView";

export const metadata = {
  title: "Mapa",
};

export default function MapaPage() {
  const points = getMapPoints();
  return <MapaView points={points} />;
}

