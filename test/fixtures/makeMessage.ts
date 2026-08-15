import type Anthropic from "@anthropic-ai/sdk";

/**
 * Builds a minimal-but-valid Anthropic.Message fixture so tests can script
 * agent-loop turns without touching the real SDK.
 */
export function makeMessage(overrides: {
  content: Anthropic.ContentBlock[];
  stopReason: Anthropic.StopReason;
}): Anthropic.Message {
  return {
    id: "msg_test",
    container: null,
    content: overrides.content,
    model: "claude-sonnet-5",
    role: "assistant",
    stop_details: null,
    stop_reason: overrides.stopReason,
    stop_sequence: null,
    type: "message",
    usage: {
      cache_creation: null,
      cache_creation_input_tokens: null,
      cache_read_input_tokens: null,
      inference_geo: null,
      input_tokens: 10,
      output_tokens: 10,
      output_tokens_details: null,
      server_tool_use: null,
      service_tier: null,
    },
  };
}

export function textBlock(text: string): Anthropic.TextBlock {
  return { type: "text", text, citations: null };
}

export function toolUseBlock(id: string, name: string, input: Record<string, unknown>): Anthropic.ToolUseBlock {
  return { type: "tool_use", id, name, input, caller: { type: "direct" } };
}
