import type { Todo } from "../types";

interface RawJsonTodo {
  text: string;
  dueDate?: string;
  done?: boolean;
}

/**
 * Parses a JSON to-do file: an array of { text, dueDate?, done? } objects.
 */
export function parseJsonTodos(content: string): Todo[] {
  const raw = JSON.parse(content) as RawJsonTodo[];
  if (!Array.isArray(raw)) {
    throw new Error("Expected the JSON to-do file to contain an array.");
  }
  return raw.map((item, index) => ({
    id: `todo-${index}`,
    text: item.text,
    dueDate: item.dueDate,
    done: item.done ?? false,
  }));
}
