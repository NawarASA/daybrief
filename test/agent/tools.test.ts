import { describe, expect, it } from "vitest";
import { toolRegistry } from "../../src/agent/tools";
import type { ToolContext } from "../../src/agent/types";
import { DemoDataProvider } from "../../src/providers/DemoDataProvider";

describe("tool dispatch", () => {
  const ctx: ToolContext = { provider: new DemoDataProvider() };

  it("get_calendar_events returns the provider's events", async () => {
    const result = await toolRegistry.get_calendar_events.handler({}, ctx);
    expect(result.isError).toBe(false);
    expect(Array.isArray(result.output)).toBe(true);
    expect((result.output as unknown[]).length).toBeGreaterThan(0);
  });

  it("draft_email_reply rejects a missing body", async () => {
    const result = await toolRegistry.draft_email_reply.handler({ emailId: "email-1" }, ctx);
    expect(result.isError).toBe(true);
  });

  it("draft_email_reply succeeds with valid input", async () => {
    const result = await toolRegistry.draft_email_reply.handler(
      { emailId: "email-1", body: "Sounds good, will follow up." },
      ctx
    );
    expect(result.isError).toBe(false);
    expect(result.output).toHaveProperty("draftId");
  });

  it("get_urgent_emails respects maxResults", async () => {
    const result = await toolRegistry.get_urgent_emails.handler({ maxResults: 1 }, ctx);
    expect(result.isError).toBe(false);
    expect((result.output as unknown[]).length).toBe(1);
  });
});
