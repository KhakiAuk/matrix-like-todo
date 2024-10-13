"use client";

import { useEffect, useState } from "react";
import { Todo } from "./types/todo";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  List,
  Typography,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./page.module.scss";
import TodoItem from "./components/TodoItem";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./components/SortableItem";

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
      setSelectedTag("NONE");
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

  const handleDragEnd = (event: DragEndEvent) => {
    console.log("fadsfadsfasdf");
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex(
        (todo) => todo.id.toString() === active.id
      );
      const newIndex = todos.findIndex(
        (todo) => todo.id.toString() === over.id
      );

      setTodos((prevTodos) => arrayMove(prevTodos, oldIndex, newIndex));
    }
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
          sx={{
            color: "#00ff00", // テキストの色
            borderColor: "#00ff00",
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "#00ff00",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#00ff00",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#00ff00",
            },
          }}
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

      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <SortableContext
          items={todos.map((todo) => todo.id.toString())}
          strategy={verticalListSortingStrategy}
        >
          <List>
            {todos.map((todo) => (
              <SortableItem key={todo.id} id={todo.id.toString()}>
                <TodoItem
                  todo={todo}
                  toggleComplete={toggleComplete}
                  deleteTodo={deleteTodo}
                  toggleTag={toggleTag}
                />
              </SortableItem>
            ))}
          </List>
        </SortableContext>
      </DndContext>
    </Box>
  );
}
