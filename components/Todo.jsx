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
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  addOrUpdateTodo,
  toggleSelectTodo,
  deleteSelectedTodos,
  toggleCompleteTodo,
  updateReminder,
} from "../redux/slices/todoSlice";
import Icon from "react-native-vector-icons/MaterialIcons";
import ReminderSection from "./ReminderSection";
import DropDownPicker from "react-native-dropdown-picker";
import { Capitalize } from "@/utils/strings";
import { convertTimeTo12Hr } from "@/utils/date";
const FILTERS = {
  now: { time: 1, id: 11, text: "just now" },
  "10min": { time: 10, id: 11, text: "before 10 min" },
  "15min": { time: 15, id: 12, text: "before 15 min" },
  "20min": { time: 20, id: 13, text: "before 20 min" },
  done: { text: "Done items", time: -1, id: 14 },
};
const getPriorityTextColor = (text) => {
  switch (text) {
    case "high":
      return "#D91656";
    case "medium":
      return "#FFA24C";
    case "low":
      return "#86D293";
  }
};
const PRIORITY = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

const Todo = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [priorityValue, setPriorityValue] = useState(null);
  const todos = useSelector((state) => state.todos.todos);
  const selectedTodos = useSelector((state) => state.todos.selectedTodos);
  const [todoText, setTodoText] = useState("");
  const [todoDesc, setTodoDesc] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredTodos, setFilteredTodo] = useState([]);
  const [filteres, setFilters] = useState([]);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const addRemiderHandler = (Itemid) => {
    setModalVisible(true);
    setCurrentTaskId(Itemid);
  };
  const reminderTimeHandler = (time) => {
    dispatch(
      updateReminder({
        reminderBefore: 10,
        reminderTimeStamp: time,
        taskId: currentTaskId,
      })
    );
  };
  const addOrUpdateTodoHandler = () => {
    if (todoText.trim() === "") return;
    const timestamp = new Date();
    dispatch(
      addOrUpdateTodo({
        id: editingTodoId || Date.now().toString(),
        text: todoText,
        description: todoDesc,
        timestamp,
        priorityValue,
      })
    );

    setEditingTodoId(null);
    setTodoText("");
    setTodoDesc("");
    setAddMode(false);
  };

  const formatTimestamp = (date) => {
    const formatedDate = new Date(date).toString().slice(0, 15);
    if (!date) return;
    const today = new Date();
    const dayDiff = today.getDate() - new Date(date).getDate();
    const todayTime = convertTimeTo12Hr(
      new Date(date).toTimeString().slice(0, 8)
    );
    switch (dayDiff) {
      case 0:
        return `Today ${todayTime}`;
      case 1:
        return "Yestarday";
      default:
        return formatedDate;
    }
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
    const reminderTime = item.reminderTime
      ? formatTimestamp(item.reminderTime)
      : "";
    const isMissed =
      new Date(item.reminderTime) - new Date() > 0 ? true : false;
    const priorityText = Capitalize(item.priority);
    return (
      <View style={[styles.todoItem, isSelected && styles.selectedTodoItem]}>
        {priorityText && (
          <View
            style={{
              position: "absolute",
              backgroundColor: "white",
              top: 5,
              right: 5,
              paddingHorizontal: 5,
              paddingVertical: 2,
              elevation: 20,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: getPriorityTextColor(item.priority) }}>
              {priorityText}
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={{ flex: 1, gap: 6 }}
          onLongPress={() => handleLongPress(item.id)}
          onPress={() => {
            if (selectedTodos.length > 0) {
              handleLongPress(item.id);
            } else {
              if (editingTodoId === item.id) return;
              dispatch(toggleCompleteTodo(item.id));
            }
          }}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.todoText,
              item.completed && styles.completedText,
              isSelected && styles.selectedTodoItemText,
            ]}
          >
            {item.text}
          </Text>
          <Text
            numberOfLines={2}
            style={[
              styles.todoDesc,
              item.completed && styles.completedText,
              isSelected && styles.selectedTodoItemText,
            ]}
          >
            {item.description}
          </Text>
          <Text style={styles.timestampText}>Added on {time}</Text>
          {reminderTime && (
            <View
              style={
                !isMissed
                  ? styles.reminderMissedBackdrop
                  : styles.reminderBackdrop
              }
            >
              <Text style={styles.reminderText}>{reminderTime}</Text>
            </View>
          )}
        </TouchableOpacity>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              if (editingTodoId === item.id) {
                addOrUpdateTodoHandler();
              } else {
                setEditingTodoId(item.id);
                setTodoText(item.text);
                setTodoDesc(item.description);
                setAddMode(true);
              }
            }}
          >
            <Icon name="edit" size={24} color="#4d4c47" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              addRemiderHandler(item.id);
            }}
          >
            <Icon name="book" size={24} color="#4d4c47" />
          </TouchableOpacity>
        </View>
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
        return maxTime > timediff;
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

  function isBeforeTimestamp(timestamp, minutes) {
    const targetTime = new Date(timestamp);
    const currentTime = new Date();
    const timeDifference = targetTime - currentTime;
    const minutesInMillis = minutes * 60 * 1000;
    return timeDifference > 0 && timeDifference <= minutesInMillis;
  }

  const triggerNotification = () => {
    let isPendingTOday = todos.some((item) => {
      return isBeforeTimestamp(item.reminderTime, item.remindBefore);
    });
    if (isPendingTOday) {
      Alert.alert("Reminder for pending task");
    }
  };
  useEffect(() => {
    let sId = setTimeout(() => {
      triggerNotification();
    }, 1000);
    return () => {
      clearTimeout(sId);
    };
  }, []);

  return (
    <View style={styles.container}>
      {addMode && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Add or edit a todo title"
            value={todoText}
            onChangeText={setTodoText}
            onSubmitEditing={addOrUpdateTodoHandler}
          />
          <TextInput
            style={styles.input}
            placeholder="Add or edit todo description"
            value={todoDesc}
            onChangeText={setTodoDesc}
            onSubmitEditing={addOrUpdateTodoHandler}
          />

          <DropDownPicker
            open={open}
            value={priorityValue}
            items={PRIORITY}
            setOpen={setOpen}
            setValue={setPriorityValue}
            placeholder={"Set priority."}
            style={[styles.input]}
          />
          <View style={{ flexDirection: "row", gap: 2 }}>
            <TouchableOpacity
              onPress={() => setAddMode(false)}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.addButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={addOrUpdateTodoHandler}
            >
              <Text style={styles.addButtonText}>
                {editingTodoId ? "Update Todo" : "Add Todo"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <View
        style={{
          flexDirection: "row",
          gap: 4,
          marginVertical: 10,
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
                  marginRight: 5,
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <ReminderSection
          onClose={() => setModalVisible(!modalVisible)}
          getReminderData={reminderTimeHandler}
        />
      </Modal>

      {!addMode && (
        <TouchableOpacity
          onPressOut={() => setAddMode(true)}
          style={{
            backgroundColor: "#ffea00",
            height: 40,
            width: 40,
            justifyContent: "center",
            alignContent: "center",
            borderRadius: 20,
            alignItems: "center",
            position: "absolute",
            right: 20,
            bottom: 90,
          }}
          onPress={addOrUpdateTodoHandler}
        >
          <Text style={{ fontSize: 30 }}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
    backgroundColor: "#fff",
    position: "relative",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
    flex: 1,
  },
  cancelButton: {
    backgroundColor: "#FFFBE6",
  },
  addButton: {
    backgroundColor: "#ffea00",
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
    gap: 15,
  },
  selectedTodoItem: {
    backgroundColor: "#d1d1d1",
  },
  selectedTodoItemText: {
    color: "#white",
  },
  todoText: {
    fontSize: 18,
    fontWeight: "600",
  },
  todoDesc: {
    fontSize: 14,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "gray",
    opacity: 0.8,
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
  reminderBackdrop: {
    backgroundColor: "#006BFF",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  reminderMissedBackdrop: {
    backgroundColor: "red",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  reminderText: {
    color: "#fff",
  },
});

export default Todo;
