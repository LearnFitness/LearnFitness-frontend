import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, Image, Pressable } from "react-native";

export default function CreateWorkoutPlanPopup() {
  const [title, setTitle] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);

  const handleExerciseSelection = (exercise) => {
    // Implement logic to handle exercise selection
    if (selectedExercises.includes(exercise)) {
      setSelectedExercises(selectedExercises.filter(item => item !== exercise));
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Own Workout Plan</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
      />
      <ScrollView style={styles.exerciseContainer}>
        {/* Assume exercises are passed as props from ExercisesScreen */}
        {exercises.map((exercise, index) => (
          <Pressable
            key={index}
            style={[styles.exerciseItem, selectedExercises.includes(exercise) ? styles.selectedExercise : null]}
            onPress={() => handleExerciseSelection(exercise)}
          >
            <Text style={styles.exerciseName}>{exercise.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.imageCard}>
        {/* Image card component for displaying the plan */}
        <Image source={require("./../../assets/workout_plans_images/leg1.jpg")} style={styles.image} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  exerciseContainer: {
    maxHeight: 200,
    marginBottom: 20,
  },
  exerciseItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedExercise: {
    backgroundColor: "lightblue",
  },
  exerciseName: {
    fontSize: 16,
  },
  imageCard: {
    width: 300,
    height: 200,
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
