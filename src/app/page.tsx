"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { Todo } from "./types/todo";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  // Stores(init, Computed)
  useEffect(() => {
    const savedTodos = JSON.parse(
      sessionStorage.getItem("todos") ?? "[]"
    ) as Todo[];
    if (savedTodos) {
      setTodos(savedTodos);
    }
  }, []);
  useEffect(() => {
    sessionStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Funcs
  const addTodo = () => {
    if (inputValue.trim() !== "") {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: inputValue,
          completed: false,
          tag: selectedTag,
        },
      ]);
      setInputValue("");
    }
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      addTodo();
    }
  };
  const deleteTodo = (id: number) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  };
  const toggleComplete = (id: number) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
  };
  const clearCompleted = () => {
    const newTodos = todos.filter((todo) => !todo.completed);
    setTodos(newTodos);
  };
  const toggleTag = (id: number) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        const currentIndex = tags.indexOf(todo.tag);
        const nextIndex = (currentIndex + 1) % tags.length;
        return { ...todo, tag: tags[nextIndex] };
      }
      return todo;
    });
    setTodos(newTodos);
  };

  const tags = [
    "NONE",
    "URGENT & IMPORTANT",
    "IMPORTANT",
    "URGENT",
    "Low Priority...",
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>TODOリスト</h1>
        <button onClick={clearCompleted} className={styles.clearButton}>
          🗑️ チェック済みタスクを削除
        </button>
      </header>

      <div className={styles.todoForm}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="新しいタスクを追加"
          className={styles.todoInput}
        />
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className={styles.tagSelect}
        >
          <option value="">タグを選択</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <button onClick={addTodo} className={styles.addButton}>
          追加
        </button>
      </div>

      <ul className={styles.todoList}>
        {todos.map((todo) => (
          <li key={todo.id} className={styles.todoItem}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id)}
            />
            <span className={todo.completed ? styles.completed : ""}>
              {todo.text}
            </span>
            <span
              className={styles.tagBox}
              style={{ backgroundColor: todo.tag, cursor: "pointer" }}
              onClick={() => toggleTag(todo.id)}
            ></span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className={styles.deleteButton}
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
