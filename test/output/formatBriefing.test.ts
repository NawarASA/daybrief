import { describe, expect, it } from "vitest";
import { formatBriefing } from "../../src/output/formatBriefing";
import { SUPPORT_URL } from "../../src/config/constants";

describe("formatBriefing", () => {
  it("includes the briefing text, date label, and support link", () => {
    const output = formatBriefing("Your briefing body.", "Sunday, August 16");
    expect(output).toContain("Your briefing body.");
    expect(output).toContain("Sunday, August 16");
    expect(output).toContain(SUPPORT_URL);
  });
});
