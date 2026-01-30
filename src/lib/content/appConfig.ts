export type AppConfig = {
  eventName: string;
  eventTag: string;
  logoUrl: string; // can be empty -> fallback circle

  landingTitle: string;
  landingSubtitle: string;

  mapDescription: string;
  privacyText: string;
};

export const DEFAULT_CONFIG: AppConfig = {
  eventName: "Swat & Smart 2026",
  eventTag: "EVENTO",
  logoUrl: "",

  landingTitle: "Bienvenido",
  landingSubtitle: "Inicia sesión para continuar.",

  mapDescription: "Zonas clave · Punto de encuentro · Salones y breaks",
  privacyText: [
    "Aviso de Privacidad",
    "",
    "Última actualización: enero 2026",
    "",
    "Este texto es un placeholder. Sustitúyelo por tu aviso legal completo.",
  ].join("\n"),
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

