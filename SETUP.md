# Setting up live mode

DayBrief works instantly with `--demo` and needs no setup at all. This guide is only for
**live mode** - connecting your real Google Calendar and Gmail.

## 1. Create a Google Cloud project

1. Go to [console.cloud.google.com](https://console.cloud.google.com/) and create a new project
   (or reuse an existing one).

## 2. Enable the APIs

1. In the left sidebar, go to **APIs & Services → Library**.
2. Search for **Google Calendar API** and click **Enable**.
3. Search for **Gmail API** and click **Enable**.

## 3. Configure the OAuth consent screen

1. Go to **APIs & Services → OAuth consent screen**.
2. Choose **External** (unless you're on a Google Workspace domain).
3. Fill in an app name (e.g. "DayBrief") and your email for the required fields.
4. Add yourself as a **test user**. You can leave the app in "Testing" status - it's just for you.

## 4. Create OAuth client credentials

1. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
2. Application type: **Desktop app**. (Not "Web application" - the CLI needs a local loopback
   redirect, which only the Desktop app client type supports without pre-registering exact URIs.)
3. Copy the **Client ID** and **Client Secret**.

## 5. Add your credentials

Copy `.env.example` to `.env` and fill in:

```
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

## 6. Connect your account

```bash
daybrief auth
```

This opens your browser to Google's consent screen. Approve the requested scopes (read your
calendar, read your email, and create drafts - DayBrief never sends email on its own). Once
approved, your tokens are stored locally at `~/.daybrief/token.json`.

## 7. Set your location (for weather)

```bash
daybrief config --location "Austin, TX"
```

## 8. Run it

```bash
daybrief
```

To disconnect your Google account at any time: `daybrief auth --logout`.

### Scopes requested

DayBrief asks for the minimum it needs:

- `calendar.readonly` - read today's events. Never creates, edits, or deletes anything.
- `gmail.readonly` - read recent email metadata/snippets to judge what's urgent.
- `gmail.compose` - create draft replies for you to review. DayBrief never sends email.
