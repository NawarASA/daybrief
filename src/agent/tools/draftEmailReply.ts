import type { ToolDefinition } from "../types";
import { safeToolCall } from "./toolHelpers";

export const draftEmailReplyTool: ToolDefinition = {
  schema: {
    name: "draft_email_reply",
    description:
      "Creates a Gmail DRAFT reply for the user to review and send themselves. This tool NEVER sends " +
      "email - it only saves a draft. Use it when an email genuinely needs a reply today.",
    input_schema: {
      type: "object",
      properties: {
        emailId: { type: "string", description: "The id of the email being replied to." },
        body: { type: "string", description: "The plain-text body of the suggested reply." },
        subject: { type: "string", description: "Optional subject line override for the draft." },
      },
      required: ["emailId", "body"],
    },
  },
  handler: async (input, ctx) => {
    const emailId = input.emailId;
    const body = input.body;
    if (typeof emailId !== "string" || typeof body !== "string") {
      return { output: { error: "emailId and body are required strings." }, isError: true };
    }
    const subject = typeof input.subject === "string" ? input.subject : undefined;
    return safeToolCall("Could not create draft", () => ctx.provider.draftEmailReply(emailId, body, subject));
  },
};
