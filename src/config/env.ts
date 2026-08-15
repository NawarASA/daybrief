import dotenv from "dotenv";
import { DaybriefError } from "../output/errors";

dotenv.config();

export function requireAnthropicApiKey(): string {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new DaybriefError(
      "ANTHROPIC_API_KEY is not set. Add it to a .env file (see .env.example) or export it in your shell."
    );
  }
  return key;
}
