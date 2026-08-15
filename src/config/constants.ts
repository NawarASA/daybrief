import * as os from "os";
import * as path from "path";

export const MODEL_ID = "claude-sonnet-5";
export const MAX_TURNS = 8;

// Placeholder - swap in your real Buy Me a Coffee (or similar) link.
export const SUPPORT_URL = "https://buymeacoffee.com/yourname";

export const CONFIG_DIR = path.join(os.homedir(), ".daybrief");
export const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");
export const TOKEN_FILE = path.join(CONFIG_DIR, "token.json");

export const DEFAULT_TODO_FILE = path.join(CONFIG_DIR, "todos.md");
