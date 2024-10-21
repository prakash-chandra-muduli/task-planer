import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import Todo from "../../components/Todo";
import LottieView from "lottie-react-native";
import { Link, type ErrorBoundaryProps } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;
const index = () => {
  return (
    <SafeAreaView>
      <View style={{ height: screenHeight, width: screenWidth }}>
        <Link href={"/progress"}>
          <Text>RTK</Text>
        </Link>
        <Todo />
      </View>
    </SafeAreaView>
  );
};

export default index;
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const animation = useRef<LottieView>(null);
  return (
    <SafeAreaView>
      <View style={styles.errorScreenContainer}>
        <Text>{error.message}</Text>
        <LottieView
          autoPlay
          ref={animation}
          style={{
            width: 400,
            height: 400,
            backgroundColor: "#eee",
          }}
          source={require("../../assets/lotties/errorLottie.json")}
        />
        <Text onPress={retry}>Try Again?</Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  errorScreenContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: screenHeight,
    backgroundColor: "#f5eded",
  },
});
