export type TeamKey = "equipo1" | "equipo2" | "equipo3" | "equipo4";

export type TeamInfo = {
  key: TeamKey;
  label: string;
  salon: string;
};

export const TEAMS: TeamInfo[] = [
  { key: "equipo1", label: "Equipo 1", salon: "Ludoteca" },
  { key: "equipo2", label: "Equipo 2", salon: "Fantasía" },
  { key: "equipo3", label: "Equipo 3", salon: "Inmersódromo" },
  { key: "equipo4", label: "Equipo 4", salon: "Floripondios" },
];

export const TEAM_MEMBERS: Record<TeamKey, string[]> = {
  equipo1: [
    "Fernando Varon",
    "Alina Altamirano",
    "Astrid Ramirez",
    "Edwin de la Orta",
    "Elena Guerra",
    "Fernanda Andrea Balieiro Valenzuela",
    "Fernando Sánchez",
    "Julio Osorio",
    "Lila Ramirez",
    "Marco Morales",
    "Miguel Jaramillo",
    "Open Position",
    "Oscar Garcia",
    "Reina Martinez",
    "Yazmin Rubio",
  ],
  equipo2: [
    "Roberto Salas",
    "Santiago Moreno",
    "Alberto Beltran",
    "Anayatzin Ochoa",
    "Berenice Leal",
    "Reynaldo Avilés",
    "Angelli Zetina",
    "Mafe Rodriguez",
    "Andrea Natalia Marin",
    "Cindy Perez",
    "Carlos Aguilar",
    "Omar Bermudez",
    "Maria Fernanda Maya",
    "Sebastian Alfaro",
    "Alejandro Hernandez",
  ],
  equipo3: [
    "Jesús Toraño",
    "Daniel Soto",
    "Victor Marin",
    "Rosa Mendoza",
    "Fernando Dinorin",
    "Alejandra Avila",
    "Gabriela Veras",
    "Maria Ale Moreno",
    "Maru Ortiz",
    "Villavelazquez David",
    "Julieta Chavez",
    "Alicia Gutierrez",
    "Maria Moreno",
    "Pablo López",
    "Daniela Tenorio",
  ],
  equipo4: [
    "Olivia Espinosa",
    "Omar Mendez",
    "Gabriela Martínez",
    "Beatriz Vilchis",
    "Sandra Sierra",
    "García Pablo",
    "Carranza Natalia",
    "Eduardo Pacheco",
    "Carlos Anda",
    "Dominique Saunders",
    "Marigel Gonzalez",
    "Miguel Barrientos",
    "César Araya",
    "Nancy Padron",
  ],
};

export type BreakoutRoom = {
  name: string;
  salon: string;
  location: string;
};

export const BREAKOUT_ROOMS: BreakoutRoom[] = [
  {
    name: "El Juego del Endulzar",
    salon: "LUDOTECA",
    location: "XXXX",
  },
  {
    name: "La Casa de los Sobres",
    salon: "Senderos",
    location: "Entre la alberca y el restaurante Recuerdos",
  },
  {
    name: "Sweetgerton",
    salon: "FLORIPONDIOS",
    location: "A un lado de la terraza del restaurante Recuerdos",
  },
  {
    name: "Splend a Thnings",
    salon: "INMERSÓDROMO",
    location: "Atrás de la recepción",
  },
];

export const SCHEDULE_TIMES = ["10:30 a. m.", "11:10 a. m.", "11:50 a. m.", "12:30 p. m."];

// Each row = which team number (1-4) is in that room at each time slot
export const SCHEDULE_GRID: number[][] = [
  [1, 4, 3, 2], // El Juego del Endulzar
  [2, 1, 4, 3], // La Casa de los Sobres
  [3, 2, 1, 4], // Sweetgerton
  [4, 3, 2, 1], // Splend a Thnings
];
