-- Agenda editable by admins
-- Run in Supabase SQL Editor

create table if not exists public.agenda_items (
  id text primary key,
  title text not null,
  day date not null,
  start_time text not null,
  end_time text not null,
  track text not null check (track in ('Plenario','Expositores','Otros')),
  location text not null,
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Optional: updated_at trigger (reuse if you already created it)
do $$
begin
  if not exists (select 1 from pg_proc where proname = 'set_updated_at' and pronamespace = 'public'::regnamespace) then
    create or replace function public.set_updated_at()
    returns trigger language plpgsql as $fn$
    begin
      new.updated_at = now();
      return new;
    end
    $fn$;
  end if;
end$$;

drop trigger if exists trg_agenda_items_updated_at on public.agenda_items;
create trigger trg_agenda_items_updated_at
before update on public.agenda_items
for each row execute function public.set_updated_at();

alter table public.agenda_items enable row level security;

-- Authenticated users can read agenda
drop policy if exists "agenda_read_authenticated" on public.agenda_items;
create policy "agenda_read_authenticated"
on public.agenda_items
for select
to authenticated
using (true);

-- Admins update via server routes using service role key (recommended).
-- If you want DB-enforced admin writes via RLS, implement it with a non-recursive approach
-- (e.g. custom JWT claims or security definer functions).

