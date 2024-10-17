import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  addOrUpdateTodo,
  toggleSelectTodo,
  deleteSelectedTodos,
  toggleCompleteTodo,
} from "../redux/slices/todoSlice";
import EditIcon from "react-native-vector-icons/MaterialIcons";
const FILTERS = {
  now: { time: 1, id: 11, text: "just now" },
  "10min": { time: 10, id: 11, text: "before 10 min" },
  "15min": { time: 15, id: 12, text: "before 15 min" },
  "20min": { time: 20, id: 13, text: "before 20 min" },
  done: { text: "Done items", time: -1, id: 14 },
};
const Todo = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.todos);
  const selectedTodos = useSelector((state) => state.todos.selectedTodos);
  const [todoText, setTodoText] = React.useState("");
  const [editingTodoId, setEditingTodoId] = React.useState(null);
  const [isFiltering, setIsFiltering] = React.useState(false);
  const [filteredTodos, setFilteredTodo] = useState([]);
  const [filteres, setFilters] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const addOrUpdateTodoHandler = () => {
    if (todoText.trim() === "") return;
    const timestamp = new Date();
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
    if (!date) return;
    const today = new Date();
    return new Date(date).toDateString() === today.toDateString()
      ? "Today"
      : date?.toLocaleString();
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

  const renderItem = ({ item }) => {
    const isSelected = selectedTodos.includes(item.id);
    const time = formatTimestamp(item.timestamp);
    return (
      <View style={[styles.todoItem, isSelected && styles.selectedTodoItem]}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onLongPress={() => handleLongPress(item.id)}
          onPress={() => {
            if (editingTodoId === item.id) return;
            dispatch(toggleCompleteTodo(item.id));
          }}
        >
          <Text
            style={[
              styles.todoText,
              item.completed && styles.completedText,
              isSelected && styles.selectedTodoItemText,
            ]}
          >
            {item.text}
          </Text>
          <Text style={styles.timestampText}>{time}</Text>
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
          <EditIcon name="edit" size={24} color="#4d4c47" />
        </TouchableOpacity>
      </View>
    );
  };
  const selectOrRemoveFilterHandler = (key) => {
    if (filteres.includes(key)) {
      let restFilters = filteres.filter((item) => item != key);
      setFilters(restFilters);
    } else {
      setFilters((ps) => [...ps, key]);
    }
  };

  const updatefilterListHandler = (filteres) => {
    const maxTime = filteres.reduce((acc, item) => {
      return FILTERS[item].time > acc ? FILTERS[item].time : acc;
    }, 0);

    let filteredData = [...todos];

    if (maxTime > 0) {
      filteredData = filteredData.filter((item) => {
        let currentTime = new Date();
        let timestamp = new Date(item.timestamp);
        const timediff = Math.floor((currentTime - timestamp) / (1000 * 60));
        return maxTime < timediff;
      });
    }

    if (filteres.includes("done")) {
      filteredData = filteredData.filter((item) => {
        return item.completed === true;
      });
    }
    setFilteredTodo(filteredData);
  };

  useEffect(() => {
    if (filteres.length > 0) {
      setIsFiltering(true);
    } else setIsFiltering(false);
    updatefilterListHandler(filteres);
  }, [filteres]);
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
      {/* <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>filter</Text>
      </TouchableOpacity> */}
      <View
        style={{
          flexDirection: "row",
          gap: 4,
        }}
      >
        <ScrollView
          style={{ gap: 2 }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {Object.keys(FILTERS).map((item) => {
            const isSelected = filteres.includes(item);
            const tag = FILTERS[item].text;
            return (
              <TouchableOpacity
                style={{
                  backgroundColor: isSelected ? "#ffc800" : "#e8e8e8",
                  paddingVertical: 2,
                  paddingHorizontal: 6,
                  borderRadius: 10,
                }}
                onPress={() => selectOrRemoveFilterHandler(item)}
              >
                <Text style={{ fontSize: 12 }}>{tag}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      {selectedTodos.length > 0 && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteSelectedTodos}
        >
          <Text style={styles.deleteButtonText}>Delete Selected</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={isFiltering ? filteredTodos : todos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalcontainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Hello World!</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal> */}
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
    backgroundColor: "#ffea00",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  addButtonText: {
    color: "black",
    fontWeight: "bold",
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderRadius: 12,
    marginBottom: 3,
    backgroundColor: "white",
    elevation: 2,
  },
  selectedTodoItem: {
    backgroundColor: "#d1d1d1",
  },
  selectedTodoItemText: {
    color: "#white",
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
  modalcontainer: {
    backgroundColor: "red",
    position: "absolute",
    bottom: 0,
  },
});

export default Todo;
