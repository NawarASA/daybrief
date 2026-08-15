import type { Todo } from "../types";

const CHECKBOX_LINE = /^\s*-\s*\[( |x|X)\]\s*(.+)$/;
const DUE_DATE_SUFFIX = /\(due:\s*(\d{4}-\d{2}-\d{2})\)\s*$/;

/**
 * Parses a Markdown checklist, e.g.:
 *   - [ ] Submit expense report (due: 2026-08-14)
 *   - [x] Book flight
 */
export function parseMarkdownTodos(content: string): Todo[] {
  const todos: Todo[] = [];
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    const match = line.match(CHECKBOX_LINE);
    if (!match) {
      return;
    }
    const done = match[1].toLowerCase() === "x";
    let text = match[2].trim();
    let dueDate: string | undefined;
    const dueMatch = text.match(DUE_DATE_SUFFIX);
    if (dueMatch) {
      dueDate = dueMatch[1];
      text = text.slice(0, dueMatch.index).trim();
    }
    todos.push({ id: `todo-${index}`, text, dueDate, done });
  });
  return todos;
}
