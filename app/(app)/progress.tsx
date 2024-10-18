import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useGetPokemonByNameQuery } from "@/redux/services/pokemon";

const progress = () => {
  const { data, error, isLoading } = useGetPokemonByNameQuery("meowth");
  console.log(data);

  if (isLoading) return <Text>Loding</Text>;

  return (
    <View>
      {data && (
        <>
          <Text>{data.name}</Text>
          <Text>{data.height}</Text>
          <Text>{data.species.name}</Text>
        </>
      )}
    </View>
  );
};

export default progress;

const styles = StyleSheet.create({});
