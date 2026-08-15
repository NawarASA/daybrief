import type { CalendarEvent, EmailSummary, Todo, WeatherSummary } from "../types";

export interface DraftEmailReplyResult {
  draftId: string;
}

/**
 * Everything a tool handler needs to fetch real-world data, implemented once
 * against mocked data (DemoDataProvider) and once against real APIs
 * (LiveDataProvider). Tool handlers never branch on demo-vs-live themselves.
 */
export interface DataSourceProvider {
  getCalendarEvents(): Promise<CalendarEvent[]>;
  getUrgentEmails(maxResults?: number): Promise<EmailSummary[]>;
  draftEmailReply(emailId: string, body: string, subject?: string): Promise<DraftEmailReplyResult>;
  getWeather(): Promise<WeatherSummary>;
  getTodos(): Promise<Todo[]>;
}
