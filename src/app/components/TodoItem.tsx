import {
  Button,
  Checkbox,
  ListItem,
  ListItemText,
  IconButton,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "../page.module.scss";
import { Todo } from "../types/todo";

export default function TodoItem({
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
