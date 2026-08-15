const SAMPLE_BRIEFING = `$ npx github:NawarASA/daybrief --demo

☀ DayBrief — Sunday, August 16

Heads up: your 10:00 Design Review overlaps with your 10:30 1:1
with Priya. Worth moving one of them — the 1:1 is easier to shift.

Sarah's email about the Q3 deadline needs a reply today; I've
drafted one in your Gmail drafts for you to review and send.

Light rain expected, high 61° / low 52° — bring a jacket.

You've got 3 open to-dos, including an overdue expense report.
If you only do one thing today: reply to Sarah before the design
review.

☕ Support this project: https://buymeacoffee.com/yourname`;

export default function DemoPreview() {
  return (
    <section className="section">
      <div className="container">
        <h2>Sample output</h2>
        <p className="section-lede">
          A representative <code>--demo</code> run — real Claude reasoning over mocked data.
        </p>
        <pre className="terminal">
          <code>{SAMPLE_BRIEFING}</code>
        </pre>
      </div>
    </section>
  );
}
