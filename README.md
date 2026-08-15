# DayBrief

[![CI](https://github.com/NawarASA/daybrief/actions/workflows/ci.yml/badge.svg)](https://github.com/NawarASA/daybrief/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**An LLM agent that turns your calendar, email, weather, and to-dos into one actionable morning
briefing.**

Most "AI assistant" demos are a single prompt and a single response. DayBrief is a real
tool-calling agent: it gives Claude five tools (calendar, email, weather, to-dos, and
draft-a-reply) and lets the model decide what to check and in what order, then synthesizes
everything into a few short, useful paragraphs — not a dump of raw data.

```bash
npx github:NawarASA/daybrief --demo
```

That runs instantly with mocked data (a real Claude call, fake calendar/email/weather) — no Google
account, no API keys to set up beyond your own `ANTHROPIC_API_KEY`. See it in the browser:
**[daybrief site](#)** *(add your deployed site URL here)*.

## Sample output

```
$ npx github:NawarASA/daybrief --demo

☀ DayBrief — Sunday, August 16

Heads up: your 10:00 Design Review overlaps with your 10:30 1:1
with Priya. Worth moving one of them — the 1:1 is easier to shift.

Sarah's email about the Q3 deadline needs a reply today; I've
drafted one in your Gmail drafts for you to review and send.

Light rain expected, high 61° / low 52° — bring a jacket.

You've got 3 open to-dos, including an overdue expense report.
If you only do one thing today: reply to Sarah before the design
review.

☕ Support this project: https://buymeacoffee.com/yourname
```

*(Swap this in for a real terminal recording once you've captured one — see "Recording a real demo"
below.)*

## How it works

1. **You run `daybrief`.** It starts an agent loop against Claude (`claude-sonnet-5`), giving it
   five tools: `get_calendar_events`, `get_urgent_emails`, `draft_email_reply`, `get_weather`,
   `get_todos`.
2. **Claude decides what to check**, in whatever order it thinks makes sense - this is genuine
   tool-use, not a fixed script.
3. **It reasons, not just reports:** conflicts get flagged with a suggested fix, only genuinely
   urgent email gets a drafted reply (`draft_email_reply` only ever creates a Gmail *draft* - it
   never sends), weather only comes up if it should change your plans.
4. **You get one clear briefing** - a few short paragraphs ending with the one thing worth
   prioritizing today.

The demo/live split is a single seam: a `DataSourceProvider` interface implemented once by
`DemoDataProvider` (canned data, zero credentials) and once by `LiveDataProvider` (real Google +
weather APIs). Every tool handler talks to the interface, not to demo-or-live directly - see
[`src/providers`](src/providers) and [`src/agent/agentLoop.ts`](src/agent/agentLoop.ts).

## Install

```bash
npx github:NawarASA/daybrief --demo
```

No install step, no build - it runs your local Node + a couple of npm packages via `tsx`. Requires
Node 18.17+ and an `ANTHROPIC_API_KEY` (copy `.env.example` to `.env`, or export it in your shell).

## Live mode

Live mode connects your real Google Calendar and Gmail, plus a real to-do file. It needs a bit of
one-time setup - see **[SETUP.md](SETUP.md)** for the full Google Cloud Console walkthrough.
Short version:

```bash
daybrief config --location "Austin, TX"   # for weather
daybrief auth                             # connects Google Calendar + Gmail
daybrief                                  # runs a real briefing
```

## Commands

```
daybrief                          run a live briefing (requires prior `daybrief auth`)
daybrief --demo                   run with mocked data - still a real Claude call
daybrief --verbose                print each tool call and result as it happens
daybrief --todo-file <path>       override the configured to-do file for this run only
daybrief config [--location "..."] [--todo-file <path>] [--show]
daybrief auth [--logout]
```

## Development

```bash
npm install
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm test           # vitest
npm start          # node bin/daybrief.js
```

Everything is unit-tested without hitting real APIs: the agent loop takes an injected chat-client
interface (scripted fixture responses, no SDK mocking), tool dispatch runs against a fake
`DataSourceProvider`, weather/geocoding take an injected `HttpClient`, and Google token handling is
tested with a temp file and a fake `invalid_grant` failure. CI (`.github/workflows/ci.yml`) runs
lint, typecheck, and the full test suite on every push - no secrets required.

The docs/landing site in [`site/`](site/) is an independent Vite + React app (`cd site && npm
install && npm run dev`), deployed separately (e.g. Vercel with root directory `site/`).

### Recording a real demo

Once you have an `ANTHROPIC_API_KEY`, record a real `--demo` run (e.g. with
[asciinema](https://asciinema.org/) or [vhs](https://github.com/charmbracelet/vhs)) and swap it in
for the sample output above and in `site/src/components/DemoPreview.tsx`.

## Why these design choices

- **`npx github:` distribution, no build step.** TypeScript runs directly via `tsx`'s require hook.
  `prepare`/`postinstall` scripts aren't reliably run for git-installed packages across npm
  versions, so every runtime dependency lives in `dependencies` and nothing depends on a build
  step running - see `bin/daybrief.js`.
- **Manual agent loop**, not the Anthropic SDK's beta Tool Runner - more legible as a demonstration
  of tool-calling architecture, and trivial to unit test via a minimal injected client interface.
- **Open-Meteo for weather** - free, keyless, no signup - so `--demo` truly needs nothing beyond an
  Anthropic key.

## License

MIT - see [LICENSE](LICENSE).

☕ **[Support this project](https://buymeacoffee.com/yourname)** *(placeholder - swap in your real
link)*
