import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import Todo from "../../components/Todo";
import { SafeAreaView } from "react-native-safe-area-context";
const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;
const index = () => {
  return (
    <SafeAreaView>
      <View style={{ height: screenHeight, width: screenWidth }}>
        <Todo />
      </View>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({});
