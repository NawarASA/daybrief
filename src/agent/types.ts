import type Anthropic from "@anthropic-ai/sdk";
import type { DataSourceProvider } from "../providers/DataSourceProvider";

/**
 * Minimal seam over the Anthropic client so the agent loop can be unit
 * tested by injecting a stub that returns scripted Message objects, with no
 * SDK module-mocking required.
 */
export interface ChatModel {
  createMessage(params: Anthropic.MessageCreateParamsNonStreaming): Promise<Anthropic.Message>;
}

export interface ToolContext {
  provider: DataSourceProvider;
}

export interface ToolResult {
  output: unknown;
  isError: boolean;
}

export interface ToolDefinition {
  schema: Anthropic.Tool;
  handler: (input: Record<string, unknown>, ctx: ToolContext) => Promise<ToolResult>;
}
