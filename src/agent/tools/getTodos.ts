import type { ToolDefinition } from "../types";
import { safeToolCall } from "./toolHelpers";

export const getTodosTool: ToolDefinition = {
  schema: {
    name: "get_todos",
    description:
      "Returns the user's full to-do list, including which items are overdue based on today's date.",
    input_schema: { type: "object", properties: {} },
  },
  handler: async (_input, ctx) => safeToolCall("Could not fetch to-dos", () => ctx.provider.getTodos()),
};
