import * as http from "http";
import { AuthError } from "../output/errors";
import { openBrowser } from "../openBrowser";
import { saveToken } from "./tokenStore";
import { createOAuthClient, LOOPBACK_PORT, SCOPES } from "./oauthClient";

/**
 * Runs the interactive first-run OAuth flow: opens the system browser to
 * Google's consent screen, catches the redirect on a local loopback server,
 * exchanges the code for tokens, and persists them.
 */
export async function runFirstTimeAuth(): Promise<void> {
  const client = createOAuthClient();
  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });

  const code = await new Promise<string>((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url ?? "/", `http://localhost:${LOOPBACK_PORT}`);
      if (url.pathname !== "/oauth2callback") {
        res.writeHead(404).end();
        return;
      }
      const error = url.searchParams.get("error");
      const authCode = url.searchParams.get("code");
      res.writeHead(200, { "Content-Type": "text/html" });
      if (error || !authCode) {
        res.end("<h1>DayBrief authorization failed</h1><p>You can close this tab.</p>");
        server.close();
        reject(new AuthError(`Google authorization failed: ${error ?? "no code returned"}`));
        return;
      }
      res.end("<h1>DayBrief connected</h1><p>You can close this tab and return to the terminal.</p>");
      server.close();
      resolve(authCode);
    });
    server.listen(LOOPBACK_PORT, () => {
      console.log("Opening your browser to connect your Google account...");
      openBrowser(authUrl);
    });
  });

  const { tokens } = await client.getToken(code);
  saveToken(tokens);
  console.log("Google account connected. Run `daybrief` to get your first live briefing.");
}
