import React, { forwardRef, useState, memo, useCallback, useMemo } from 'react';
import { StyleSheet, View, FlatList, Text, Pressable, Alert, TouchableOpacity } from 'react-native';
import { useInfiniteHits } from 'react-instantsearch-core';
import FastImage from "react-native-fast-image";
import { useNavigation } from '@react-navigation/native';

export default InfiniteHits = forwardRef(
  ({ ...props }, ref) => {
    const { hits, isLastPage, showMore } = useInfiniteHits({ ...props, escapeHTML: false, });
    const navigation = useNavigation();

    // Use callback to avoid re-render of items
    const renderExerciseItem = useCallback(({ item }) =>
      <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate("ExerciseModal", { exerciseId: item.objectID })} style={styles.exerciseContainer}>
        <FastImage source={{ uri: item.gifUrl }} style={styles.exerciseGif} />
        <View style={{ maxWidth: "80%" }}>
          <Text style={styles.exerciseName}>{item.name}</Text>
          <Text style={styles.exerciseBodyPart}>{item.bodyPart}</Text>
        </View>
      </TouchableOpacity>
      , []);

    return (
      <FlatList
        ref={ref}
        data={hits}
        keyExtractor={item => item.objectID}
        onEndReached={() => { if (!isLastPage) showMore(); }}
        renderItem={renderExerciseItem}
      />
    );
  });

const styles = StyleSheet.create({
  exerciseContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    margin: 3,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 5,
  },
  exerciseGif: {
    width: 55,
    height: 55,
    borderRadius: 5,
    marginRight: 10
  },
  exerciseName: {
    color: "white",
    fontSize: 18,
    paddingBottom: 5,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  exerciseBodyPart: {
    color: "darkgrey",
    fontSize: 15,
    textTransform: "capitalize"
  }
});