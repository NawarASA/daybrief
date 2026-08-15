import type { ToolDefinition } from "../types";
import { safeToolCall } from "./toolHelpers";

export const getUrgentEmailsTool: ToolDefinition = {
  schema: {
    name: "get_urgent_emails",
    description:
      "Returns recent/unread email candidates (sender, subject, snippet, received time). This tool " +
      "does NOT pre-judge urgency - you decide from the subject and snippet which ones actually need " +
      "attention or a reply today.",
    input_schema: {
      type: "object",
      properties: {
        maxResults: {
          type: "number",
          description: "Maximum number of emails to return. Defaults to 10.",
        },
      },
    },
  },
  handler: async (input, ctx) => {
    const maxResults = typeof input.maxResults === "number" ? input.maxResults : undefined;
    return safeToolCall("Could not fetch emails", () => ctx.provider.getUrgentEmails(maxResults));
  },
};
