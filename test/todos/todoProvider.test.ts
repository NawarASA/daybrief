import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { afterEach, describe, expect, it } from "vitest";
import { createTodoProvider } from "../../src/todos/todoProvider";

describe("createTodoProvider", () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "daybrief-todos-"));

  afterEach(() => {
    for (const file of fs.readdirSync(tmpDir)) {
      fs.unlinkSync(path.join(tmpDir, file));
    }
  });

  it("returns an empty list when the file does not exist", async () => {
    const provider = createTodoProvider(path.join(tmpDir, "missing.md"));
    expect(await provider.getTodos()).toEqual([]);
  });

  it("parses a .md file as Markdown", async () => {
    const filePath = path.join(tmpDir, "todos.md");
    fs.writeFileSync(filePath, "- [ ] Do the thing\n");
    const todos = await createTodoProvider(filePath).getTodos();
    expect(todos).toMatchObject([{ text: "Do the thing", done: false }]);
  });

  it("parses a .json file as JSON", async () => {
    const filePath = path.join(tmpDir, "todos.json");
    fs.writeFileSync(filePath, JSON.stringify([{ text: "Do the thing" }]));
    const todos = await createTodoProvider(filePath).getTodos();
    expect(todos).toMatchObject([{ text: "Do the thing", done: false }]);
  });
});
