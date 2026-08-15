import { runFirstTimeAuth } from "../google/authFlow";
import { deleteToken } from "../google/tokenStore";

export interface AuthCommandOptions {
  logout: boolean;
}

export async function authCommand(opts: AuthCommandOptions): Promise<void> {
  if (opts.logout) {
    deleteToken();
    console.log("Disconnected your Google account.");
    return;
  }
  await runFirstTimeAuth();
}
