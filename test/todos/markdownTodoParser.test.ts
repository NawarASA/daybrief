import { describe, expect, it } from "vitest";
import { parseMarkdownTodos } from "../../src/todos/markdownTodoParser";

describe("parseMarkdownTodos", () => {
  it("parses open and done checkboxes, ignoring non-checkbox lines", () => {
    const content = [
      "# My to-dos",
      "",
      "- [ ] Submit expense report (due: 2026-08-14)",
      "- [x] Book flight",
      "Just a note, not a to-do.",
    ].join("\n");

    const todos = parseMarkdownTodos(content);
    expect(todos).toHaveLength(2);
    expect(todos[0]).toMatchObject({ text: "Submit expense report", dueDate: "2026-08-14", done: false });
    expect(todos[1]).toMatchObject({ text: "Book flight", dueDate: undefined, done: true });
  });

  it("supports detecting an overdue item by comparing the parsed due date to today", () => {
    const [todo] = parseMarkdownTodos("- [ ] Renew passport (due: 2020-01-01)");
    expect(todo.dueDate).toBe("2020-01-01");
    expect(new Date(todo.dueDate as string) < new Date()).toBe(true);
  });

  it("returns an empty array for content with no checklist items", () => {
    expect(parseMarkdownTodos("Just some prose.\nNo checkboxes here.")).toEqual([]);
  });
});
