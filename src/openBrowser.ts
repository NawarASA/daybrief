import { exec } from "child_process";

/**
 * Opens a URL in the system's default browser. Deliberately dependency-free
 * (no npm "open" package) to avoid ESM-only-package interop questions under
 * the CJS require-hook used for distribution.
 */
export function openBrowser(url: string): void {
  const platform = process.platform;
  const command =
    platform === "darwin"
      ? `open "${url}"`
      : platform === "win32"
        ? `start "" "${url}"`
        : `xdg-open "${url}"`;
  exec(command, (err) => {
    if (err) {
      console.error(`Could not open a browser automatically. Open this URL manually:\n${url}`);
    }
  });
}
