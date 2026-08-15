import * as fs from "fs";
import { CONFIG_DIR, CONFIG_FILE, DEFAULT_TODO_FILE } from "./constants";

export interface DaybriefConfig {
  location?: { name: string; latitude: number; longitude: number };
  todoFilePath?: string;
}

export function loadConfig(): DaybriefConfig {
  if (!fs.existsSync(CONFIG_FILE)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8")) as DaybriefConfig;
}

export function saveConfig(config: DaybriefConfig): void {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function getTodoFilePath(config: DaybriefConfig): string {
  return config.todoFilePath ?? DEFAULT_TODO_FILE;
}
