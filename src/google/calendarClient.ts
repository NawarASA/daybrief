import { google } from "googleapis";
import type { OAuth2Client } from "google-auth-library";
import type { CalendarEvent } from "../types";
import { withGoogleErrorHandling } from "./oauthClient";

export async function fetchTodaysEvents(auth: OAuth2Client): Promise<CalendarEvent[]> {
  return withGoogleErrorHandling(async () => {
    const calendar = google.calendar({ version: "v3", auth });
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const { data } = await calendar.events.list({
      calendarId: "primary",
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    return (data.items ?? [])
      .filter((event) => event.id && (event.start?.dateTime || event.start?.date))
      .map((event) => ({
        id: event.id as string,
        title: event.summary ?? "(no title)",
        start: (event.start?.dateTime ?? event.start?.date) as string,
        end: (event.end?.dateTime ?? event.end?.date) as string,
        location: event.location ?? undefined,
      }));
  });
}
