import type { CalendarEvent, EmailSummary, Todo, WeatherSummary } from "../types";
import type { DataSourceProvider, DraftEmailReplyResult } from "./DataSourceProvider";

function todayAt(hour: number, minute: number): string {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

/**
 * Realistic canned data with deliberate scenarios so a --demo run always
 * produces an interesting briefing: a calendar conflict, an email that
 * clearly needs a reply, rain in the forecast, and an overdue to-do.
 * No network calls, no credentials required.
 */
export class DemoDataProvider implements DataSourceProvider {
  private readonly drafts: Array<{ emailId: string; body: string; subject?: string }> = [];

  async getCalendarEvents(): Promise<CalendarEvent[]> {
    return [
      {
        id: "evt-1",
        title: "Design review",
        start: todayAt(10, 0),
        end: todayAt(11, 0),
        location: "Conference Room B",
      },
      {
        id: "evt-2",
        title: "1:1 with Priya",
        start: todayAt(10, 30),
        end: todayAt(11, 0),
        location: "Zoom",
      },
      {
        id: "evt-3",
        title: "Team lunch",
        start: todayAt(12, 30),
        end: todayAt(13, 30),
        location: "Courtyard",
      },
    ];
  }

  async getUrgentEmails(maxResults = 10): Promise<EmailSummary[]> {
    const emails: EmailSummary[] = [
      {
        id: "email-1",
        from: "Sarah Chen <sarah.chen@example.com>",
        subject: "Need your sign-off on the Q3 deadline by EOD",
        snippet:
          "Hey, we're finalizing the Q3 roadmap and need your approval on the revised deadline before end of day...",
        receivedAt: daysAgo(0),
        isUnread: true,
      },
      {
        id: "email-2",
        from: "newsletter@devweekly.example.com",
        subject: "This week in dev: 12 links you'll actually read",
        snippet: "Your weekly roundup of the best engineering writing from around the web...",
        receivedAt: daysAgo(0),
        isUnread: true,
      },
      {
        id: "email-3",
        from: "Marcus Lee <marcus.lee@example.com>",
        subject: "Re: Lunch next week?",
        snippet: "Works for me! Let's do Tuesday around noon if that still works on your end.",
        receivedAt: daysAgo(1),
        isUnread: false,
      },
    ];
    return emails.slice(0, maxResults);
  }

  async draftEmailReply(emailId: string, body: string, subject?: string): Promise<DraftEmailReplyResult> {
    this.drafts.push({ emailId, body, subject });
    return { draftId: `demo-draft-${this.drafts.length}` };
  }

  async getWeather(): Promise<WeatherSummary> {
    return {
      locationName: "your area",
      description: "light rain",
      highTempF: 61,
      lowTempF: 52,
      precipitationChancePercent: 80,
    };
  }

  async getTodos(): Promise<Todo[]> {
    return [
      {
        id: "todo-1",
        text: "Submit expense report",
        dueDate: daysAgo(2).slice(0, 10),
        done: false,
      },
      {
        id: "todo-2",
        text: "Review pull request #482",
        dueDate: undefined,
        done: false,
      },
      {
        id: "todo-3",
        text: "Book dentist appointment",
        dueDate: undefined,
        done: false,
      },
    ];
  }
}
