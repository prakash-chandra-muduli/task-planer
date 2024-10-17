import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Todo {
    id: string;
    text: string;
    timestamp: string;
    completed: boolean;
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
    name: 'todos',
    initialState,
    reducers: {
        addOrUpdateTodo: (state, action: PayloadAction<Todo>) => {
            const { id, text, timestamp } = action.payload;
            const existingTodo = state.todos.find(todo => todo.id === id);

            if (existingTodo) {
                existingTodo.text = text;
                existingTodo.timestamp = timestamp;
            } else {
                state.todos.push({ id, text, timestamp, completed: false });
            }
        },
        toggleCompleteTodo: (state, action: PayloadAction<string>) => {
            const todo = state.todos.find(todo => todo.id === action.payload);
            if (todo) {
                todo.completed = !todo.completed;
            }
        },
        toggleSelectTodo: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            if (state.selectedTodos.includes(id)) {
                state.selectedTodos = state.selectedTodos.filter(todoId => todoId !== id);
            } else {
                state.selectedTodos.push(id);
            }
        },
        deleteSelectedTodos: (state) => {
            state.todos = state.todos.filter(todo => !state.selectedTodos.includes(todo.id));
            state.selectedTodos = []; 
        },
        clearSelectedTodos: (state) => {
            state.selectedTodos = []; 
        },
    },
});

export const { addOrUpdateTodo, toggleCompleteTodo, toggleSelectTodo, deleteSelectedTodos, clearSelectedTodos } = todoSlice.actions;

export default todoSlice.reducer;
