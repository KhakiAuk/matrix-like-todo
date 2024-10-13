import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { Todo } from "./types/todo";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  // Stores(init, Computed)
  useEffect(() => {
    const savedTodos = JSON.parse(sessionStorage.getItem("todos") ?? "");
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
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      addTodo();
    }
  };
  const toggleComplete = (id: ) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
  };

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
          onKeyPress={handleKeyPress}
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
              style={{ backgroundColor: todo.tag }}
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
