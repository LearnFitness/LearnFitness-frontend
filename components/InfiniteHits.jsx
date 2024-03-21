import React, { forwardRef, useState } from 'react';
import { StyleSheet, View, FlatList, Text, Pressable } from 'react-native';
import { useInfiniteHits } from 'react-instantsearch-core';
import firestore from "@react-native-firebase/firestore";
import ExerciseModal from './ExerciseModal';
import FastImage from "react-native-fast-image";

export default InfiniteHits = forwardRef(
  ({ ...props }, ref) => {
    const { hits, isLastPage, showMore } = useInfiniteHits({ ...props, escapeHTML: false, });
    const [exercise, setExercise] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);

    async function handleViewItem(item) {
      const exercise = await firestore().collection("exercises").doc(item.objectID).get();
      setExercise(exercise.data());
      setModalVisible(true);
    }

    return (<>
      <FlatList
        ref={ref}
        data={hits}
        keyExtractor={(item) => item.objectID}
        onEndReached={() => { if (!isLastPage) showMore(); }}
        renderItem={({ item }) => (<SearchResult item={item} />)}
      />

      <ExerciseModal exercise={exercise} isModalVisible={isModalVisible} setModalVisible={setModalVisible} />
    </>
    );

    function SearchResult({ item }) {
      return (
        <Pressable onPress={() => handleViewItem(item)} style={styles.exerciseContainer}>
          <FastImage source={{ uri: item.gifUrl }} style={styles.exerciseGif} />
          <View style={{ paddingRight: 50 }}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <Text style={styles.exerciseBodyPart}>{item.bodyPart}</Text>
          </View>
        </Pressable>
      )
    }
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