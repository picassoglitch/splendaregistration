-- Seed agenda_items from the current mock JSON (src/data/agenda.json)
-- Run after SUPABASE_AGENDA_SCHEMA.sql

insert into public.agenda_items
  (id, title, day, start_time, end_time, track, location, description)
values
  ('plenario-apertura','Apertura · Swat & Smart 2026','2026-01-30','09:00','09:30','Plenario','Salón 1','Bienvenida oficial y overview del día. Presentación de agenda, logística y mensajes clave del evento.

Sugerencia: llega 10 min antes para registro y ubicación.'),
  ('expo-keynote','Keynote · Tendencias y casos de éxito','2026-01-30','09:30','10:15','Expositores','Salón 1','Una sesión inspiradora con aprendizajes prácticos y ejemplos reales.

Se cubrirán 3 pilares: estrategia, ejecución y medición.'),
  ('break-cafe','Coffee break · Networking','2026-01-30','10:15','10:45','Otros','Lobby','Café, snacks y espacio para conectar con otros asistentes.

Tip: revisa el mapa para ubicar zonas clave.'),
  ('plenario-panel','Panel · Innovación aplicada','2026-01-30','10:45','11:30','Plenario','Salón 1','Conversación moderada con líderes invitados.

Se abordarán retos y oportunidades 2026.'),
  ('expo-demo','Demo · Soluciones y activaciones','2026-01-30','11:30','12:15','Expositores','Sala A','Demostración guiada con puntos concretos: setup, flujo y resultados.

Incluye espacio para Q&A.'),
  ('otros-cierre','Cierre · Próximos pasos','2026-01-30','12:15','12:30','Otros','Salón 1','Resumen, agradecimientos y recordatorios.')
on conflict (id) do update set
  title = excluded.title,
  day = excluded.day,
  start_time = excluded.start_time,
  end_time = excluded.end_time,
  track = excluded.track,
  location = excluded.location,
  description = excluded.description;

