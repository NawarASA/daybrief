import chalk from "chalk";
import { Command } from "commander";
import { authCommand } from "./commands/authCommand";
import { configCommand } from "./commands/configCommand";
import { runBriefingCommand } from "./commands/runBriefing";
import { DaybriefError } from "./output/errors";

const program = new Command();

program
  .name("daybrief")
  .description("An agent that assembles your calendar, email, weather, and to-dos into one morning briefing.")
  .version("0.1.0")
  .option("--demo", "run with mocked data - no Google/weather setup required", false)
  .option("--verbose", "print each tool call and result as it happens", false)
  .option("--todo-file <path>", "override the configured to-do file for this run only")
  .action(async (options: { demo: boolean; verbose: boolean; todoFile?: string }) => {
    await runBriefingCommand({ demo: options.demo, verbose: options.verbose, todoFile: options.todoFile });
  });

program
  .command("config")
  .description("set your location (for weather) and to-do file path")
  .option("--location <city>", 'e.g. "Austin, TX"')
  .option("--todo-file <path>", "path to a Markdown or JSON to-do file")
  .option("--show", "print the current config", false)
  .action(async (options: { location?: string; todoFile?: string; show: boolean }) => {
    await configCommand(options);
  });

program
  .command("auth")
  .description("connect your Google account (Calendar + Gmail) for live mode")
  .option("--logout", "disconnect your Google account", false)
  .action(async (options: { logout: boolean }) => {
    await authCommand(options);
  });

async function main() {
  try {
    await program.parseAsync(process.argv);
  } catch (err) {
    const exitCode = err instanceof DaybriefError ? err.exitCode : 1;
    const message = err instanceof Error ? err.message : String(err);
    console.error(chalk.red(`✗ ${message}`));
    process.exitCode = exitCode;
  }
}

void main();
