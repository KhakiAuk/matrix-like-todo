// src/composables/useTodos.ts
import { useState, useEffect } from "react";
import { Todo } from "../types/todo";
import { useTags } from "./useTags"; // useTags をインポート

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  // useTagsフックを使用してタグを管理
  const {
    selectedTag,
    setSelectedTag,
    tags,
    toggleTag: toggleTagHandler,
  } = useTags();

  // sessionStorageからタスクをロード
  useEffect(() => {
    const savedTodos = JSON.parse(
      sessionStorage.getItem("todos") ?? "[]"
    ) as Todo[];
    if (savedTodos.length) {
      setTodos(savedTodos);
    }
  }, []);

  // todosが変わるたびにsessionStorageに保存
  useEffect(() => {
    sessionStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // タスクを追加する関数
  const addTodo = () => {
    if (inputValue.trim() !== "") {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: inputValue,
          completed: false,
          tag: selectedTag ? selectedTag : "NONE",
        },
      ]);
      setInputValue("");
      setSelectedTag(selectedTag);
    }
  };

  // タスクを削除
  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // タスクの完了状態をトグル
  const toggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 完了したタスクを削除
  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const toggleTag = (id: number) => {
    toggleTagHandler(id, todos, setTodos);
  };

  return {
    todos,
    inputValue,
    selectedTag,
    tags,
    setTodos,
    setInputValue,
    setSelectedTag,
    addTodo,
    deleteTodo,
    toggleComplete,
    clearCompleted,
    toggleTag,
  };
}
