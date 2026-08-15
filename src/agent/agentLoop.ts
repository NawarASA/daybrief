import type Anthropic from "@anthropic-ai/sdk";
import { MAX_TURNS, MODEL_ID } from "../config/constants";
import type { DataSourceProvider } from "../providers/DataSourceProvider";
import { DaybriefError } from "../output/errors";
import { buildSystemPrompt } from "./systemPrompt";
import { getToolSchemas, toolRegistry } from "./tools";
import type { ChatModel, ToolContext } from "./types";

export type ToolEvent =
  | { type: "tool_call"; name: string; input: unknown }
  | { type: "tool_result"; name: string; output: unknown; isError: boolean };

export interface RunBriefingAgentOptions {
  client: ChatModel;
  provider: DataSourceProvider;
  todayIso: string;
  onToolEvent?: (event: ToolEvent) => void;
}

function extractText(content: Anthropic.ContentBlock[]): string {
  return content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
}

async function dispatchTool(
  name: string,
  input: Record<string, unknown>,
  ctx: ToolContext,
  onToolEvent?: (event: ToolEvent) => void
): Promise<{ output: unknown; isError: boolean }> {
  onToolEvent?.({ type: "tool_call", name, input });
  const tool = toolRegistry[name];
  if (!tool) {
    const result = { output: { error: `Unknown tool: ${name}` }, isError: true };
    onToolEvent?.({ type: "tool_result", name, ...result });
    return result;
  }
  const result = await tool.handler(input, ctx);
  onToolEvent?.({ type: "tool_result", name, output: result.output, isError: result.isError });
  return result;
}

export async function runBriefingAgent(opts: RunBriefingAgentOptions): Promise<string> {
  const ctx: ToolContext = { provider: opts.provider };
  const tools = getToolSchemas();
  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: "Please assemble today's morning briefing.",
    },
  ];

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const response = await opts.client.createMessage({
      model: MODEL_ID,
      max_tokens: 4096,
      system: buildSystemPrompt({ todayIso: opts.todayIso }),
      output_config: { effort: "medium" },
      tools,
      messages,
    });

    messages.push({ role: "assistant", content: response.content });

    if (response.stop_reason !== "tool_use") {
      return extractText(response.content);
    }

    const toolUses = response.content.filter(
      (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
    );

    const resultBlocks: Anthropic.ToolResultBlockParam[] = await Promise.all(
      toolUses.map(async (toolUse) => {
        const { output, isError } = await dispatchTool(
          toolUse.name,
          toolUse.input as Record<string, unknown>,
          ctx,
          opts.onToolEvent
        );
        return {
          type: "tool_result",
          tool_use_id: toolUse.id,
          content: JSON.stringify(output),
          is_error: isError,
        };
      })
    );

    messages.push({ role: "user", content: resultBlocks });
  }

  throw new DaybriefError(
    `Agent exceeded ${MAX_TURNS} turns without finishing - use --verbose to see the tool trace.`
  );
}
