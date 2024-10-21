import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";
const ReminderSection = ({ onClose, getReminderData }) => {
  const [date, setDateState] = useState(new Date());
  const isAndroid = Platform.OS === "android";
  const chooseDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDateState(currentDate);
    if (event.type === "set") {
      getReminderData(currentDate);
      onClose();
    }
  };
  return (
    <View style={styles.container}>
      {isAndroid ? (
        <RNDateTimePicker
          display="spinner"
          mode="date"
          value={date}
          minimumDate={new Date()}
          onChange={chooseDate}
        />
      ) : (
        <RNDateTimePicker
          display="spinner"
          mode="datetime"
          value={date}
          minimumDate={new Date()}
          onChange={chooseDate}
        />
      )}
      <Text>Date and Time</Text>
      <Pressable onPress={onClose}>
        <Text>Close</Text>
      </Pressable>
    </View>
  );
};
export default ReminderSection;
const styles = StyleSheet.create({
  container: {
    zIndex: 999,
  },
});
