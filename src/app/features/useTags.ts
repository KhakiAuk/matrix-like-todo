// src/composables/useTags.ts

import { useState } from "react";
import { Todo } from "../types/todo";

// タグのリスト
const tagList = [
  "NONE",
  "URGENT & IMPORTANT",
  "IMPORTANT",
  "URGENT",
  "Low Priority...",
];

// useTags フック
export function useTags() {
  const [selectedTag, setSelectedTag] = useState<string>("NONE");

  // タグをトグルする関数
  const toggleTag = (
    id: number,
    todos: Todo[],
    setTodos: (todos: Todo[]) => void
  ) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        const currentIndex = tagList.indexOf(todo.tag);
        const nextIndex = (currentIndex + 1) % tagList.length;
        return { ...todo, tag: tagList[nextIndex] };
      }
      return todo;
    });
    setTodos(newTodos);
  };

  return {
    selectedTag,
    setSelectedTag,
    tags: tagList,
    toggleTag,
  };
}
