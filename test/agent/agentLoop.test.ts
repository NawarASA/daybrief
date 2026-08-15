import { describe, expect, it, vi } from "vitest";
import type Anthropic from "@anthropic-ai/sdk";
import { runBriefingAgent, type ToolEvent } from "../../src/agent/agentLoop";
import type { ChatModel } from "../../src/agent/types";
import { DemoDataProvider } from "../../src/providers/DemoDataProvider";
import { makeMessage, textBlock, toolUseBlock } from "../fixtures/makeMessage";

function scriptedClient(responses: Anthropic.Message[]): ChatModel {
  let call = 0;
  return {
    createMessage: vi.fn(async () => {
      const response = responses[call];
      call++;
      return response;
    }),
  };
}

describe("runBriefingAgent", () => {
  it("dispatches a tool call then returns the final text response", async () => {
    const client = scriptedClient([
      makeMessage({
        content: [toolUseBlock("call-1", "get_weather", {})],
        stopReason: "tool_use",
      }),
      makeMessage({
        content: [textBlock("Rain today, bring an umbrella.")],
        stopReason: "end_turn",
      }),
    ]);

    const result = await runBriefingAgent({
      client,
      provider: new DemoDataProvider(),
      todayIso: "2026-08-16",
    });

    expect(result).toBe("Rain today, bring an umbrella.");
    expect(client.createMessage).toHaveBeenCalledTimes(2);
  });

  it("dispatches multiple tool_use blocks from a single turn and reports events", async () => {
    const client = scriptedClient([
      makeMessage({
        content: [
          toolUseBlock("call-1", "get_weather", {}),
          toolUseBlock("call-2", "get_todos", {}),
        ],
        stopReason: "tool_use",
      }),
      makeMessage({
        content: [textBlock("Briefing done.")],
        stopReason: "end_turn",
      }),
    ]);

    const events: ToolEvent[] = [];
    const result = await runBriefingAgent({
      client,
      provider: new DemoDataProvider(),
      todayIso: "2026-08-16",
      onToolEvent: (e) => events.push(e),
    });

    expect(result).toBe("Briefing done.");
    const calls = events.filter((e) => e.type === "tool_call").map((e) => e.name);
    expect(calls.sort()).toEqual(["get_todos", "get_weather"]);
    const results = events.filter((e) => e.type === "tool_result");
    expect(results).toHaveLength(2);
    expect(results.every((e) => e.type === "tool_result" && e.isError === false)).toBe(true);
  });

  it("surfaces an unknown tool name as an error tool_result instead of crashing", async () => {
    const client = scriptedClient([
      makeMessage({
        content: [toolUseBlock("call-1", "not_a_real_tool", {})],
        stopReason: "tool_use",
      }),
      makeMessage({
        content: [textBlock("Handled the failure gracefully.")],
        stopReason: "end_turn",
      }),
    ]);

    const result = await runBriefingAgent({
      client,
      provider: new DemoDataProvider(),
      todayIso: "2026-08-16",
    });

    expect(result).toBe("Handled the failure gracefully.");
  });

  it("throws once MAX_TURNS is exceeded by a runaway tool_use loop", async () => {
    const infiniteToolUse = () =>
      makeMessage({
        content: [toolUseBlock("call-n", "get_weather", {})],
        stopReason: "tool_use",
      });
    const client: ChatModel = {
      createMessage: vi.fn(async () => infiniteToolUse()),
    };

    await expect(
      runBriefingAgent({ client, provider: new DemoDataProvider(), todayIso: "2026-08-16" })
    ).rejects.toThrow(/exceeded/i);
  });
});
