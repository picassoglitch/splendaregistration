export type Track = "Plenario" | "Expositores" | "Otros";

export type AgendaItem = {
  id: string;
  title: string;
  startTime: string; // "09:00"
  endTime: string; // "10:00"
  day: string; // "2026-01-30"
  track: Track;
  location: string;
  description: string;
};

export type MapPointType = "zona" | "encuentro" | "salon-break";

export type MapPoint = {
  id: string;
  title: string;
  type: MapPointType;
  description: string;
};

