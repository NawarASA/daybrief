import * as fs from "fs";
import * as path from "path";
import type { Credentials } from "google-auth-library";
import { TOKEN_FILE } from "../config/constants";

export function loadToken(filePath: string = TOKEN_FILE): Credentials | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as Credentials;
}

export function saveToken(credentials: Credentials, filePath: string = TOKEN_FILE): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(credentials, null, 2), { mode: 0o600 });
}

export function deleteToken(filePath: string = TOKEN_FILE): void {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
