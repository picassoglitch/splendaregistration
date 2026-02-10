export type AgendaDayKey = "17-feb" | "18-feb" | "19-feb";

export type AgendaRow = {
  start: string;
  end: string;
  duration: string;
  activity: string;
  place: string;
};

export const AGENDA: Record<AgendaDayKey, AgendaRow[]> = {
  "17-feb": [
    { start: "8:00am", end: "8:30am", duration: "30 min", activity: "Salida de Santa Fe | Hotel Hilton", place: "Oficinas Santa Fe Bahia / Bahia Hilton" },
    { start: "8:30am", end: "10:40am", duration: "2.10 hrs", activity: "Traslado", place: "Tansporte Sprinters" },
    { start: "11:00am", end: "12:00pm", duration: "1hr", activity: "Check in y entrega de giveaway (tiempo para cambiar de outfit)", place: "Recepción Casa de los arboles" },
    { start: "12:00pm", end: "12:45pm", duration: "45 min", activity: "Bienvenida convención 2026 (reglas generales) & Foto Grupal", place: "Mural" },
    { start: "12:45pm", end: "2:00pm", duration: "1.15 hr", activity: "Comida&Break", place: "Restaurante Naranjos" },
    { start: "2:00pm", end: "3:30pm", duration: "1.30 hr", activity: "Comercial Sweet&Smart News", place: "Salon Cafeto" },
    { start: "3:30pm", end: "4:30pm", duration: "1hr", activity: "SLIM FAST", place: "Salon Cafeto" },
    { start: "4:30pm", end: "4:45pm", duration: "15min", activity: "Break", place: "Libre" },
    { start: "4:45pm", end: "5:45pm", duration: "1 hr", activity: "HAKA & SHIELD", place: "Zona Xochimilco" },
    { start: "5:45pm", end: "7:00pm", duration: "1.15 hr", activity: "Break", place: "Libre" },
    { start: "7:00pm", end: "8:30pm", duration: "1.30 hr", activity: "Cena", place: "Inmersódromo" },
    { start: "8:30pm", end: "9:30pm", duration: "1 hr", activity: "Sweet Choice Award", place: "Inmersódromo" },
  ],
  "18-feb": [
    { start: "7:30am", end: "8:30am", duration: "1 hr", activity: "Actividad Fisica", place: "Enramada Arcadas" },
    { start: "8:30am", end: "9:00am", duration: "30 min", activity: "Break", place: "Libre" },
    { start: "9:00am", end: "10:00am", duration: "1 hr", activity: "Desayuno", place: "Restaurante Recuerdos" },
    { start: "10:30am", end: "1:30pm", duration: "3 hr", activity: "Marketing", place: "4 Salones" },
    { start: "1:30pm", end: "2:30pm", duration: "1hr", activity: "Cienpies Humano", place: "Zona Coral" },
    { start: "2:30pm", end: "3:30pm", duration: "1 hr", activity: "Comida", place: "Zona Coral" },
    { start: "3:30pm", end: "4:30pm", duration: "1 hr", activity: "Actividad Coffe Creamer", place: "Salon Cafeto" },
    { start: "4:30pm", end: "6:00pm", duration: "1.30 hr", activity: "Treasurehunt", place: "Zona Coral" },
    { start: "6:00pm", end: "8:00pm", duration: "2hr", activity: "Break", place: "Libre" },
    // NOTE: Keep as-provided; ends next day, but we show "8:00pm–2:00am"
    { start: "8:00pm", end: "2:00am", duration: "4hr", activity: "Dolcenocturna", place: "Zona Coral" },
  ],
  "19-feb": [
    { start: "9:00am", end: "10:30am", duration: "1.30 min", activity: "Desayuno", place: "Restaurante Soles" },
    { start: "10:30am", end: "11:00am", duration: "30min", activity: "Cierre de convención", place: "Salon Cafeto" },
    { start: "11:00am", end: "12:00pm", duration: "1 hr", activity: "Checkout", place: "Recepción Casa de los arboles" },
    { start: "12:00pm", end: "3:00pm", duration: "3 horas", activity: "Llegada a Sta Fe y Aeropuerto", place: "Transporte Sprinter" },
  ],
};

export const AGENDA_DAYS: { key: AgendaDayKey; label: string }[] = [
  { key: "17-feb", label: "17 Feb" },
  { key: "18-feb", label: "18 Feb" },
  { key: "19-feb", label: "19 Feb" },
];

