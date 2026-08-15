import type { ToolDefinition } from "../types";
import { safeToolCall } from "./toolHelpers";

export const getCalendarEventsTool: ToolDefinition = {
  schema: {
    name: "get_calendar_events",
    description:
      "Returns every event on today's calendar in a single call, including title, start/end time, " +
      "and location. Do not call this more than once per briefing.",
    input_schema: { type: "object", properties: {} },
  },
  handler: async (_input, ctx) =>
    safeToolCall("Could not fetch calendar events", () => ctx.provider.getCalendarEvents()),
};
