import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Todo {
  id: string;
  text: string;
  timestamp: string;
  completed: boolean;
  reminderTime: string;
  remindBefore: number;
  description: string;
  priority: string;
}

export interface TodoState {
  todos: Todo[];
  selectedTodos: string[];
}

const initialState: TodoState = {
  todos: [],
  selectedTodos: [],
};

export const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addOrUpdateTodo: (state, action: PayloadAction<Todo>) => {
      const { id, text, timestamp, description, priorityValue } =
        action.payload;
      const existingTodo = state.todos.find((todo) => todo.id === id);

      if (existingTodo) {
        existingTodo.text = text;
        existingTodo.timestamp = timestamp;
        existingTodo.description = description;
        existingTodo.priority = priorityValue;
      } else {
        state.todos.push({
          id,
          text,
          timestamp,
          description,
          completed: false,
          priority: priorityValue,
          remindBefore: 10,
        });
      }
    },
    addReminder: (state, action: PayloadAction<Todo>) => {
      const { reminderTimeStamp, reminderBefore } = action.payload;
    },
    updateReminder: (state, action: PayloadAction<Todo>) => {
      const { reminderTimeStamp, reminderBefore, taskId } = action.payload;
      let task = state.todos.find((item) => item.id === taskId);
      task["reminderTime"] = reminderTimeStamp;
      task["remindBefore"] = reminderBefore;
    },
    toggleCompleteTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    toggleSelectTodo: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedTodos.includes(id)) {
        state.selectedTodos = state.selectedTodos.filter(
          (todoId) => todoId !== id
        );
      } else {
        state.selectedTodos.push(id);
      }
    },
    deleteSelectedTodos: (state) => {
      state.todos = state.todos.filter(
        (todo) => !state.selectedTodos.includes(todo.id)
      );
      state.selectedTodos = [];
    },
    clearSelectedTodos: (state) => {
      state.selectedTodos = [];
    },
  },
});

export const {
  addOrUpdateTodo,
  toggleCompleteTodo,
  toggleSelectTodo,
  deleteSelectedTodos,
  clearSelectedTodos,
  addReminder,
  updateReminder,
} = todoSlice.actions;

export default todoSlice.reducer;
