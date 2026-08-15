import { google } from "googleapis";
import type { OAuth2Client } from "google-auth-library";
import type { EmailSummary } from "../types";
import { withGoogleErrorHandling } from "./oauthClient";

function getHeader(headers: { name?: string | null; value?: string | null }[] | undefined, name: string): string {
  return headers?.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value ?? "";
}

export async function fetchUrgentEmails(auth: OAuth2Client, maxResults = 10): Promise<EmailSummary[]> {
  return withGoogleErrorHandling(async () => {
    const gmail = google.gmail({ version: "v1", auth });
    const { data } = await gmail.users.messages.list({
      userId: "me",
      maxResults,
      q: "in:inbox newer_than:2d",
    });

    const messages = data.messages ?? [];
    const details = await Promise.all(
      messages.map((m) =>
        gmail.users.messages.get({
          userId: "me",
          id: m.id as string,
          format: "metadata",
          metadataHeaders: ["From", "Subject", "Date"],
        })
      )
    );

    return details.map(({ data: msg }) => ({
      id: msg.id as string,
      from: getHeader(msg.payload?.headers ?? undefined, "From"),
      subject: getHeader(msg.payload?.headers ?? undefined, "Subject"),
      snippet: msg.snippet ?? "",
      receivedAt: new Date(Number(msg.internalDate ?? Date.now())).toISOString(),
      isUnread: (msg.labelIds ?? []).includes("UNREAD"),
    }));
  });
}

function encodeRawEmail(to: string, subject: string, body: string, inReplyTo: string): string {
  const headers = [
    `To: ${to}`,
    `Subject: ${subject}`,
    inReplyTo ? `In-Reply-To: ${inReplyTo}` : "",
    inReplyTo ? `References: ${inReplyTo}` : "",
    "Content-Type: text/plain; charset=utf-8",
  ]
    .filter(Boolean)
    .join("\r\n");
  const raw = `${headers}\r\n\r\n${body}`;
  return Buffer.from(raw).toString("base64url");
}

export async function createDraftReply(
  auth: OAuth2Client,
  emailId: string,
  body: string,
  subjectOverride?: string
): Promise<{ draftId: string }> {
  return withGoogleErrorHandling(async () => {
    const gmail = google.gmail({ version: "v1", auth });
    const { data: original } = await gmail.users.messages.get({
      userId: "me",
      id: emailId,
      format: "metadata",
      metadataHeaders: ["From", "Subject", "Message-ID"],
    });
    const headers = original.payload?.headers ?? undefined;
    const to = getHeader(headers, "From");
    const originalSubject = getHeader(headers, "Subject");
    const messageId = getHeader(headers, "Message-ID");
    const subject = subjectOverride ?? (originalSubject.startsWith("Re:") ? originalSubject : `Re: ${originalSubject}`);

    const { data: draft } = await gmail.users.drafts.create({
      userId: "me",
      requestBody: {
        message: {
          raw: encodeRawEmail(to, subject, body, messageId),
          threadId: original.threadId ?? undefined,
        },
      },
    });

    return { draftId: draft.id as string };
  });
}
