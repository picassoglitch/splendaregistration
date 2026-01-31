import type { AgendaItem, Track } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AgendaRow = {
  id: string;
  title: string;
  day: string; // YYYY-MM-DD
  start_time: string;
  end_time: string;
  track: Track;
  location: string;
  description: string;
};

function toItem(row: AgendaRow): AgendaItem {
  return {
    id: row.id,
    title: row.title,
    day: row.day,
    startTime: row.start_time,
    endTime: row.end_time,
    track: row.track,
    location: row.location,
    description: row.description,
  };
}

export async function getAgendaItemsSupabase(): Promise<AgendaItem[] | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("agenda_items")
      .select("id,title,day,start_time,end_time,track,location,description")
      .order("day", { ascending: true })
      .order("start_time", { ascending: true });
    if (error) return null;
    return (data as AgendaRow[]).map(toItem);
  } catch {
    return null;
  }
}

export async function getAgendaItemSupabase(id: string): Promise<AgendaItem | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("agenda_items")
      .select("id,title,day,start_time,end_time,track,location,description")
      .eq("id", decodeURIComponent(id))
      .maybeSingle();
    if (error || !data) return null;
    return toItem(data as AgendaRow);
  } catch {
    return null;
  }
}

