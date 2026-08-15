import InstallCommand from "./InstallCommand";
import { REPO_URL } from "../constants";

export default function Hero() {
  return (
    <header className="section hero">
      <div className="container">
        <p className="eyebrow">☀ An agent, not a script</p>
        <h1>Your morning briefing, assembled by an agent.</h1>
        <p className="lede">
          DayBrief is a CLI that orchestrates real Claude tool-calling across your calendar, email,
          weather, and to-do list — then hands you one clear, actionable briefing. Try it with
          mocked data in ten seconds, no setup required.
        </p>
        <InstallCommand />
        <a className="secondary-link" href={REPO_URL} target="_blank" rel="noreferrer">
          View source on GitHub →
        </a>
      </div>
    </header>
  );
}
