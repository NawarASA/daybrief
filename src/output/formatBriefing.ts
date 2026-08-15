import chalk from "chalk";
import { SUPPORT_URL } from "../config/constants";

export function formatBriefing(briefingText: string, dateLabel: string): string {
  const header = chalk.bold.cyan(`☀ DayBrief — ${dateLabel}`);
  const footer = chalk.dim(`☕ Support this project: ${SUPPORT_URL}`); // placeholder link
  return `${header}\n\n${briefingText}\n\n${footer}`;
}
