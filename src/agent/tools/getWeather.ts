import type { ToolDefinition } from "../types";
import { safeToolCall } from "./toolHelpers";

export const getWeatherTool: ToolDefinition = {
  schema: {
    name: "get_weather",
    description: "Returns today's weather forecast for the user's configured location.",
    input_schema: { type: "object", properties: {} },
  },
  handler: async (_input, ctx) => safeToolCall("Could not fetch weather", () => ctx.provider.getWeather()),
};
