"use client";

import { useEffect, useState } from "react";
import { Todo } from "./types/todo";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./page.module.css"; // CSS モジュールをインポート

// TodoItemコンポーネントを定義
function TodoItem({
  todo,
  toggleComplete,
  deleteTodo,
  toggleTag,
}: {
  todo: Todo;
  toggleComplete: (id: number) => void;
  deleteTodo: (id: number) => void;
  toggleTag: (id: number) => void;
}) {
  return (
    <ListItem
      key={todo.id}
      secondaryAction={
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => toggleTag(todo.id)}
            className={styles.button}
          >
            {todo.tag}
          </Button>

          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => deleteTodo(todo.id)}
            className={styles.button}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      }
      divider
      className={styles.listItemDivider}
    >
      <Checkbox
        checked={todo.completed}
        onChange={() => toggleComplete(todo.id)}
        className={styles.checkbox}
      />
      <ListItemText
        primary={todo.text}
        className={`${styles.listItemText} ${
          todo.completed ? styles.strikethrough : ""
        }`}
        onClick={() => toggleTag(todo.id)}
      />
    </ListItem>
  );
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("NONE");

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

  // タスクを追加
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
      setSelectedTag(""); // タグをリセット
    }
  };

  // Enterキーでタスクを追加
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      addTodo();
    }
  };

  // タスクを削除
  const deleteTodo = (id: number) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  };

  // タスクの完了状態を切り替え
  const toggleComplete = (id: number) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
  };

  // チェック済みのタスクを全て削除
  const clearCompleted = () => {
    const newTodos = todos.filter((todo) => !todo.completed);
    setTodos(newTodos);
  };

  // タグを切り替える
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
    <Box className={styles.container}>
      <Typography variant="h4" gutterBottom className={styles.header}>
        TODO list
        <Button
          variant="outlined"
          color="inherit"
          onClick={clearCompleted}
          startIcon={<DeleteIcon />}
          className={styles.button}
        >
          Delete DONE!
        </Button>
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="新しいタスクを追加"
          variant="outlined"
          fullWidth
          autoFocus
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          className={styles.textField}
          InputProps={{
            style: {
              color: "#00ff00",
              borderColor: "#00ff00",
            },
          }}
          InputLabelProps={{
            style: { color: "#00ff00" },
          }}
          sx={{
            fieldset: { borderColor: "#00ff00" },
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "#00ff00",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#00ff00",
              },
            },
          }}
        />

        <Select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          displayEmpty
          variant="outlined"
          className={styles.selectField}
        >
          <MenuItem value="">
            <em>タグを選択</em>
          </MenuItem>
          {tags.map((tag) => (
            <MenuItem key={tag} value={tag}>
              {tag}
            </MenuItem>
          ))}
        </Select>

        <Button variant="outlined" onClick={addTodo} className={styles.button}>
          追加
        </Button>
      </Box>

      <List>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            toggleComplete={toggleComplete}
            deleteTodo={deleteTodo}
            toggleTag={toggleTag}
          />
        ))}
      </List>
    </Box>
  );
}
