import type { ToolDefinition } from "../types";
import { draftEmailReplyTool } from "./draftEmailReply";
import { getCalendarEventsTool } from "./getCalendarEvents";
import { getTodosTool } from "./getTodos";
import { getUrgentEmailsTool } from "./getUrgentEmails";
import { getWeatherTool } from "./getWeather";

export const toolRegistry: Record<string, ToolDefinition> = {
  [getCalendarEventsTool.schema.name]: getCalendarEventsTool,
  [getUrgentEmailsTool.schema.name]: getUrgentEmailsTool,
  [draftEmailReplyTool.schema.name]: draftEmailReplyTool,
  [getWeatherTool.schema.name]: getWeatherTool,
  [getTodosTool.schema.name]: getTodosTool,
};

export function getToolSchemas() {
  return Object.values(toolRegistry).map((tool) => tool.schema);
}
