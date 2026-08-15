import { describe, expect, it } from "vitest";
import { parseJsonTodos } from "../../src/todos/jsonTodoParser";

describe("parseJsonTodos", () => {
  it("parses an array of todo objects, defaulting done to false", () => {
    const content = JSON.stringify([
      { text: "Submit expense report", dueDate: "2026-08-14" },
      { text: "Book flight", done: true },
    ]);
    const todos = parseJsonTodos(content);
    expect(todos).toEqual([
      { id: "todo-0", text: "Submit expense report", dueDate: "2026-08-14", done: false },
      { id: "todo-1", text: "Book flight", dueDate: undefined, done: true },
    ]);
  });

  it("throws if the JSON root is not an array", () => {
    expect(() => parseJsonTodos(JSON.stringify({ text: "not an array" }))).toThrow(/array/i);
  });
});
