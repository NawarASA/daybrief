import { describe, expect, it } from "vitest";
import { DemoDataProvider } from "../../src/providers/DemoDataProvider";

describe("DemoDataProvider", () => {
  it("returns a calendar conflict (design review overlaps 1:1)", async () => {
    const provider = new DemoDataProvider();
    const events = await provider.getCalendarEvents();
    const overlaps = events.some((a) =>
      events.some(
        (b) => a.id !== b.id && new Date(a.start) < new Date(b.end) && new Date(b.start) < new Date(a.end)
      )
    );
    expect(overlaps).toBe(true);
  });

  it("returns at least one unread, actionable-looking email", async () => {
    const provider = new DemoDataProvider();
    const emails = await provider.getUrgentEmails();
    expect(emails.some((e) => e.isUnread)).toBe(true);
  });

  it("returns rainy weather", async () => {
    const provider = new DemoDataProvider();
    const weather = await provider.getWeather();
    expect(weather.description).toMatch(/rain/i);
  });

  it("returns at least one overdue to-do", async () => {
    const provider = new DemoDataProvider();
    const todos = await provider.getTodos();
    const overdue = todos.some((t) => t.dueDate && new Date(t.dueDate) < new Date() && !t.done);
    expect(overdue).toBe(true);
  });

  it("draftEmailReply returns a unique draft id per call", async () => {
    const provider = new DemoDataProvider();
    const first = await provider.draftEmailReply("email-1", "body one");
    const second = await provider.draftEmailReply("email-1", "body two");
    expect(first.draftId).not.toBe(second.draftId);
  });
});
