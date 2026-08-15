import { OAuth2Client } from "google-auth-library";
import { AuthError, ConfigError } from "../output/errors";
import { deleteToken, loadToken, saveToken } from "./tokenStore";

export const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.compose",
];

export const LOOPBACK_PORT = 8842;
export const REDIRECT_URI = `http://localhost:${LOOPBACK_PORT}/oauth2callback`;

export function createOAuthClient(): OAuth2Client {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new ConfigError(
      "GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are not set. Follow SETUP.md to create a Google " +
        "OAuth client, then add them to your .env file."
    );
  }
  return new OAuth2Client({ clientId, clientSecret, redirectUri: REDIRECT_URI });
}

/**
 * Returns an OAuth2Client loaded with the user's stored token, wired to persist
 * any access-token refresh back to disk. Throws AuthError if no token has been
 * stored yet (the caller should point the user at `daybrief auth`).
 */
export function getAuthenticatedClient(): OAuth2Client {
  const token = loadToken();
  if (!token) {
    throw new AuthError("No Google account connected yet. Run `daybrief auth` first.");
  }
  const client = createOAuthClient();
  client.setCredentials(token);
  client.on("tokens", (refreshed) => {
    saveToken({ ...token, ...refreshed });
  });
  return client;
}

function isInvalidGrantError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return /invalid_grant/i.test(message);
}

/**
 * Wraps a Google API call so a revoked/expired refresh token (invalid_grant)
 * is turned into a clear, actionable AuthError instead of a raw Gaxios stack
 * trace, and clears the stale stored token so the next run doesn't retry it.
 */
export async function withGoogleErrorHandling<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (isInvalidGrantError(err)) {
      deleteToken();
      throw new AuthError(
        "Your Google authorization has expired or been revoked. Run `daybrief auth` to reconnect."
      );
    }
    throw err;
  }
}
