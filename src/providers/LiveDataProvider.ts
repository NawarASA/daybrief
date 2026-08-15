import type { OAuth2Client } from "google-auth-library";
import { fetchTodaysEvents } from "../google/calendarClient";
import { createDraftReply, fetchUrgentEmails } from "../google/gmailClient";
import { getAuthenticatedClient } from "../google/oauthClient";
import type { DaybriefConfig } from "../config/configStore";
import { getTodoFilePath } from "../config/configStore";
import { ConfigError } from "../output/errors";
import { createTodoProvider } from "../todos/todoProvider";
import { fetchForecast } from "../weather/forecast";
import type { CalendarEvent, EmailSummary, Todo, WeatherSummary } from "../types";
import type { DataSourceProvider, DraftEmailReplyResult } from "./DataSourceProvider";

/**
 * Wraps real Google/weather/local-file data sources. Google auth is resolved
 * lazily (and memoized) so a missing token fails on first actual use rather
 * than at construction time.
 */
export class LiveDataProvider implements DataSourceProvider {
  private authClient: OAuth2Client | null = null;

  constructor(private readonly config: DaybriefConfig) {}

  private getGoogleAuth(): OAuth2Client {
    if (!this.authClient) {
      this.authClient = getAuthenticatedClient();
    }
    return this.authClient;
  }

  async getCalendarEvents(): Promise<CalendarEvent[]> {
    return fetchTodaysEvents(this.getGoogleAuth());
  }

  async getUrgentEmails(maxResults?: number): Promise<EmailSummary[]> {
    return fetchUrgentEmails(this.getGoogleAuth(), maxResults);
  }

  async draftEmailReply(emailId: string, body: string, subject?: string): Promise<DraftEmailReplyResult> {
    return createDraftReply(this.getGoogleAuth(), emailId, body, subject);
  }

  async getWeather(): Promise<WeatherSummary> {
    const location = this.config.location;
    if (!location) {
      throw new ConfigError('No location configured. Run `daybrief config --location "City, ST"` first.');
    }
    return fetchForecast(location.latitude, location.longitude, location.name);
  }

  async getTodos(): Promise<Todo[]> {
    const todoProvider = createTodoProvider(getTodoFilePath(this.config));
    return todoProvider.getTodos();
  }
}
