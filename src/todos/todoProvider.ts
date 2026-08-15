import * as fs from "fs";
import * as path from "path";
import type { Todo } from "../types";
import { parseJsonTodos } from "./jsonTodoParser";
import { parseMarkdownTodos } from "./markdownTodoParser";

export interface TodoProvider {
  getTodos(): Promise<Todo[]>;
}

export function createTodoProvider(filePath: string): TodoProvider {
  return {
    async getTodos(): Promise<Todo[]> {
      if (!fs.existsSync(filePath)) {
        return [];
      }
      const content = fs.readFileSync(filePath, "utf8");
      const ext = path.extname(filePath).toLowerCase();
      return ext === ".json" ? parseJsonTodos(content) : parseMarkdownTodos(content);
    },
  };
}
