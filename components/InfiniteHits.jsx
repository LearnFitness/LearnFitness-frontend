import React, { forwardRef, useState, memo, useCallback, useMemo } from 'react';
import { StyleSheet, View, FlatList, Text, Pressable, Alert } from 'react-native';
import { useInfiniteHits } from 'react-instantsearch-core';
import FastImage from "react-native-fast-image";
import { useNavigation } from '@react-navigation/native';

export default InfiniteHits = forwardRef(
  ({ ...props }, ref) => {
    const { hits, isLastPage, showMore } = useInfiniteHits({ ...props, escapeHTML: false, });
    const navigation = useNavigation();

    // Use callback to avoid re-render of items
    const renderExerciseItem = useCallback(({ item }) =>
      <Pressable onPress={() => navigation.navigate("ExerciseModal", { exerciseId: item.objectID })} style={styles.exerciseContainer}>
        <FastImage source={{ uri: item.gifUrl }} style={styles.exerciseGif} />
        <View style={{ paddingRight: 50 }}>
          <Text style={styles.exerciseName}>{item.name}</Text>
          <Text style={styles.exerciseBodyPart}>{item.bodyPart}</Text>
        </View>
      </Pressable>
      , []);

    return (
      <>
        <FlatList
          ref={ref}
          data={hits}
          keyExtractor={item => item.objectID}
          onEndReached={() => { if (!isLastPage) showMore(); }}
          renderItem={renderExerciseItem}
        />
      </>
    );
  });

const styles = StyleSheet.create({
  exerciseContainer: {
    flexDirection: "row",
    padding: 10,
    margin: 5,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 5,
  },
  exerciseGif: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10
  },
  exerciseName: {
    color: "white",
    fontSize: 18,
    paddingBottom: 5,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  exerciseBodyPart: {
    color: "darkgrey",
    fontSize: 15,
    textTransform: "capitalize"
  }
});