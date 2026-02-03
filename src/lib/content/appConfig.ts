export type AppConfig = {
  eventName: string;
  eventTag: string;
  logoUrl: string; // can be empty -> fallback circle
  logoStyle: "plain" | "framed";

  landingTitle: string;
  landingSubtitle: string;
  homeSubtitle: string;
  homeAgendaLabel: string;
  homeMapLabel: string;
  agendaSubtitle: string;
  agendaTitle: string;
  agendaDayLabel: string;

  mapDescription: string;
  mapTitle: string;
  mapPageHeading: string;
  privacyText: string;
  privacyTitle: string;

  unlockPlaceholder: string;
  unlockButtonText: string;
  unlockFooterText: string;

  splashDurationMs: number;

  backgrounds: {
    splash: string;
    unlock: string;
    home: string;
    agenda: string;
    agendaDetail: string;
    mapa: string;
    privacidad: string;
    admin: string;
  };
};

export const DEFAULT_CONFIG: AppConfig = {
  eventName: "Swat & Smart 2026",
  eventTag: "EVENTO",
  logoUrl: "",
  logoStyle: "plain",

  landingTitle: "Bienvenido",
  landingSubtitle: "Inicia sesión para continuar.",
  homeSubtitle: "Tu app del evento",
  homeAgendaLabel: "Agenda",
  homeMapLabel: "Mapa",
  agendaSubtitle: "Horarios, sesiones y actividades",
  agendaTitle: "AGENDA",
  agendaDayLabel: "Martes 12",

  mapDescription: "Zonas clave · Punto de encuentro · Salones y breaks",
  mapTitle: "Mapa del recinto",
  mapPageHeading: "MAPA",
  privacyText: [
    "Aviso de Privacidad",
    "",
    "Última actualización: enero 2026",
    "",
    "Este texto es un placeholder. Sustitúyelo por tu aviso legal completo.",
  ].join("\n"),
  privacyTitle: "Aviso Privacidad",

  unlockPlaceholder: "Password",
  unlockButtonText: "Entrar",
  unlockFooterText: "Acceso por contraseña",

  splashDurationMs: 2400,

  backgrounds: {
    splash: "",
    unlock: "",
    home: "",
    agenda: "",
    agendaDetail: "",
    mapa: "",
    privacidad: "",
    admin: "",
  },
};

export const CONFIG_KEY = "ss2026.config";
export const CONFIG_EVENT = "ss2026-config";

let _cachedRaw: string | null | undefined = undefined;
let _cachedConfig: AppConfig = DEFAULT_CONFIG;

export function readConfig(): AppConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw === _cachedRaw) return _cachedConfig;
    if (!raw) {
      _cachedRaw = raw;
      _cachedConfig = DEFAULT_CONFIG;
      return _cachedConfig;
    }
    const parsed = JSON.parse(raw) as Partial<AppConfig>;
    _cachedRaw = raw;
    _cachedConfig = { ...DEFAULT_CONFIG, ...parsed };
    return _cachedConfig;
  } catch {
    _cachedRaw = null;
    _cachedConfig = DEFAULT_CONFIG;
    return _cachedConfig;
  }
}

export function writeConfig(next: AppConfig) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(next);
  localStorage.setItem(CONFIG_KEY, raw);
  _cachedRaw = raw;
  _cachedConfig = next;
  window.dispatchEvent(new Event(CONFIG_EVENT));
}

