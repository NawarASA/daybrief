import { DaybriefError } from "../../output/errors";
import type { ToolResult } from "../types";

/**
 * Runs a tool's upstream call and converts a failure into an is_error tool
 * result so Claude can note the gap in the briefing instead of the whole CLI
 * crashing. DaybriefError (auth/config problems) is deliberately NOT caught
 * here - those should fail the whole run fast, not be silently absorbed into
 * one tool's output.
 */
export async function safeToolCall(label: string, fn: () => Promise<unknown>): Promise<ToolResult> {
  try {
    const output = await fn();
    return { output, isError: false };
  } catch (err) {
    if (err instanceof DaybriefError) {
      throw err;
    }
    const message = err instanceof Error ? err.message : String(err);
    return { output: { error: `${label}: ${message}` }, isError: true };
  }
}
