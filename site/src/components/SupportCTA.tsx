import { SUPPORT_URL } from "../constants";

export default function SupportCTA() {
  return (
    <section className="section support">
      <div className="container">
        <h2>Support this project</h2>
        <p>
          DayBrief is free and open source. If it saves you time, consider buying the maintainer a
          coffee.
        </p>
        <a className="button" href={SUPPORT_URL} target="_blank" rel="noreferrer">
          ☕ Buy me a coffee
        </a>
      </div>
    </section>
  );
}
