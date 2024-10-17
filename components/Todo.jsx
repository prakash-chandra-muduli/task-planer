import React from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  addOrUpdateTodo,
  toggleSelectTodo,
  deleteSelectedTodos,
  toggleCompleteTodo,
} from "../redux/slices/todoSlice";
import Icon from "react-native-vector-icons/MaterialIcons";

const Todo = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.todos);
  const selectedTodos = useSelector((state) => state.todos.selectedTodos);
  const [todoText, setTodoText] = React.useState("");
  const [editingTodoId, setEditingTodoId] = React.useState(null);

  const addOrUpdateTodoHandler = () => {
    if (todoText.trim() === "") return;

    const timestamp = formatTimestamp(new Date());
    dispatch(
      addOrUpdateTodo({
        id: editingTodoId || Date.now().toString(),
        text: todoText,
        timestamp,
      })
    );
    setEditingTodoId(null);
    setTodoText("");
  };

  const formatTimestamp = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString()
      ? "Today"
      : date.toLocaleString();
  };

  const handleLongPress = (id) => {
    dispatch(toggleSelectTodo(id));
  };

  const handleDeleteSelectedTodos = () => {
    Alert.alert(
      "Delete Selected Todos",
      "Are you sure you want to delete the selected todos?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: () => dispatch(deleteSelectedTodos()),
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onLongPress={() => handleLongPress(item.id)}
        onPress={() => {
          if (editingTodoId === item.id) return;
          dispatch(toggleCompleteTodo(item.id));
        }}
      >
        <Text style={[styles.todoText, item.completed && styles.completedText]}>
          {item.text}
        </Text>
        <Text style={styles.timestampText}>{item.timestamp}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (editingTodoId === item.id) {
            addOrUpdateTodoHandler();
          } else {
            setEditingTodoId(item.id);
            setTodoText(item.text);
          }
        }}
      >
        <Icon name="edit" size={24} color="#007BFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Add or edit a todo"
        value={todoText}
        onChangeText={setTodoText}
        onSubmitEditing={addOrUpdateTodoHandler}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={addOrUpdateTodoHandler}
      >
        <Text style={styles.addButtonText}>
          {editingTodoId ? "Update Todo" : "Add Todo"}
        </Text>
      </TouchableOpacity>
      {selectedTodos.length > 0 && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteSelectedTodos}
        >
          <Text style={styles.deleteButtonText}>Delete Selected</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  todoText: {
    fontSize: 18,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  timestampText: {
    fontSize: 12,
    color: "#888",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Todo;
