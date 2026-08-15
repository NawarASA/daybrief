import Anthropic from "@anthropic-ai/sdk";
import { runBriefingAgent, type ToolEvent } from "../agent/agentLoop";
import type { ChatModel } from "../agent/types";
import { loadConfig } from "../config/configStore";
import { requireAnthropicApiKey } from "../config/env";
import { formatBriefing } from "../output/formatBriefing";
import { DemoDataProvider } from "../providers/DemoDataProvider";
import { LiveDataProvider } from "../providers/LiveDataProvider";
import type { DataSourceProvider } from "../providers/DataSourceProvider";

export interface RunBriefingCommandOptions {
  demo: boolean;
  verbose: boolean;
  todoFile?: string;
}

function logToolEvent(event: ToolEvent): void {
  if (event.type === "tool_call") {
    console.error(`  → calling ${event.name}(${JSON.stringify(event.input)})`);
  } else {
    const marker = event.isError ? "✗" : "✓";
    console.error(`  ${marker} ${event.name} returned ${JSON.stringify(event.output)}`);
  }
}

export async function runBriefingCommand(opts: RunBriefingCommandOptions): Promise<void> {
  const apiKey = requireAnthropicApiKey();
  const sdk = new Anthropic({ apiKey });
  const client: ChatModel = {
    createMessage: (params) => sdk.messages.create(params),
  };

  let provider: DataSourceProvider;
  if (opts.demo) {
    provider = new DemoDataProvider();
  } else {
    const config = loadConfig();
    if (opts.todoFile) {
      config.todoFilePath = opts.todoFile;
    }
    provider = new LiveDataProvider(config);
  }

  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);
  const dateLabel = today.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const briefingText = await runBriefingAgent({
    client,
    provider,
    todayIso,
    onToolEvent: opts.verbose ? logToolEvent : undefined,
  });

  console.log(formatBriefing(briefingText, dateLabel));
}
