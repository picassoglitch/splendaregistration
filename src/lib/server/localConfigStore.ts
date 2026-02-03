import { promises as fs } from "node:fs";
import path from "node:path";
import { DEFAULT_CONFIG, type AppConfig } from "@/lib/content/appConfig";

const DIR = path.join(process.cwd(), ".local");
const FILE = path.join(DIR, "app_config.json");

export async function readLocalConfig(): Promise<AppConfig> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<AppConfig>;
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function writeLocalConfig(next: AppConfig): Promise<void> {
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(next, null, 2), "utf8");
}

