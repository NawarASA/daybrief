import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let tmpConfigFile: string;

vi.mock("../../src/config/constants", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../src/config/constants")>();
  return { ...actual, get CONFIG_FILE() { return tmpConfigFile; }, get CONFIG_DIR() { return path.dirname(tmpConfigFile); } };
});

describe("configStore", () => {
  beforeEach(() => {
    tmpConfigFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "daybrief-config-")), "config.json");
  });

  afterEach(() => {
    if (fs.existsSync(tmpConfigFile)) {
      fs.unlinkSync(tmpConfigFile);
    }
  });

  it("returns an empty object when no config file exists", async () => {
    const { loadConfig } = await import("../../src/config/configStore");
    expect(loadConfig()).toEqual({});
  });

  it("round-trips a saved config", async () => {
    const { loadConfig, saveConfig } = await import("../../src/config/configStore");
    const config = { location: { name: "Austin, TX", latitude: 30.27, longitude: -97.74 } };
    saveConfig(config);
    expect(loadConfig()).toEqual(config);
  });

  it("getTodoFilePath falls back to the default when unset", async () => {
    const { getTodoFilePath } = await import("../../src/config/configStore");
    const { DEFAULT_TODO_FILE } = await import("../../src/config/constants");
    expect(getTodoFilePath({})).toBe(DEFAULT_TODO_FILE);
    expect(getTodoFilePath({ todoFilePath: "/custom/path.md" })).toBe("/custom/path.md");
  });
});
