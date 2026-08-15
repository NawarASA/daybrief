export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO 8601
  end: string; // ISO 8601
  location?: string;
}

export interface EmailSummary {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  receivedAt: string; // ISO 8601
  isUnread: boolean;
}

export interface WeatherSummary {
  locationName: string;
  description: string; // e.g. "light rain"
  highTempF: number;
  lowTempF: number;
  precipitationChancePercent: number;
}

export interface Todo {
  id: string;
  text: string;
  dueDate?: string; // ISO 8601 date
  done: boolean;
}
