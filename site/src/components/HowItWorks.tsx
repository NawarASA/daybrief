const STEPS = [
  {
    title: "You ask for a briefing",
    body: '`daybrief` starts an agent loop with Claude, giving it five tools: calendar, email, weather, to-dos, and draft-reply.',
  },
  {
    title: "Claude decides what to check",
    body: "The model calls whichever tools it needs, in whatever order makes sense — this isn't a fixed script, it's genuine tool-use.",
  },
  {
    title: "It reasons, not just reports",
    body: "Conflicts get flagged with a suggested fix, only genuinely urgent email gets a drafted reply (never sent), weather only shows up if it matters.",
  },
  {
    title: "You get one clear briefing",
    body: "A few short paragraphs, ending with the one thing worth prioritizing today.",
  },
];

export default function HowItWorks() {
  return (
    <section className="section">
      <div className="container">
        <h2>How it works</h2>
        <ol className="steps">
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <span className="step-number">{i + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
