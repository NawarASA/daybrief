import prompts from "prompts";
import { loadConfig, saveConfig } from "../config/configStore";
import { DEFAULT_TODO_FILE } from "../config/constants";
import { geocodeLocation } from "../weather/geocode";

export interface ConfigCommandOptions {
  location?: string;
  todoFile?: string;
  show?: boolean;
}

export async function configCommand(opts: ConfigCommandOptions): Promise<void> {
  const config = loadConfig();

  if (opts.show) {
    console.log(JSON.stringify(config, null, 2));
    return;
  }

  if (opts.location) {
    config.location = await geocodeLocation(opts.location);
  }
  if (opts.todoFile) {
    config.todoFilePath = opts.todoFile;
  }

  if (!opts.location && !opts.todoFile) {
    const answers = await prompts([
      {
        type: "text",
        name: "location",
        message: "City (and state/country if helpful) for weather:",
        initial: config.location?.name ?? "",
      },
      {
        type: "text",
        name: "todoFilePath",
        message: "Path to your to-do file (Markdown checklist or JSON):",
        initial: config.todoFilePath ?? DEFAULT_TODO_FILE,
      },
    ]);
    if (answers.location) {
      config.location = await geocodeLocation(answers.location);
    }
    if (answers.todoFilePath) {
      config.todoFilePath = answers.todoFilePath;
    }
  }

  saveConfig(config);
  console.log("Saved. Current config:");
  console.log(JSON.stringify(config, null, 2));
}
