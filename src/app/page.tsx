"use client";

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
import { useTodos } from "./features/useTodos";
import TodoItem from "./components/TodoItem";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./components/SortableItem";

export default function Home() {
  const {
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
  } = useTodos();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      addTodo();
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
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

      <DndContext
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
        sensors={sensors}
      >
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
