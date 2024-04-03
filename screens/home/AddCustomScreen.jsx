import React, { useState, useRef } from "react";
import { View, StyleSheet, ScrollView, Pressable, Text } from "react-native";
import LinearBackground from "../../components/LinearBackground";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

// Need to make this searchable 
const mockExercises = [
  { id: 1, name: "Exercise 1" },
  { id: 2, name: "Exercise 2" },
  { id: 3, name: "Exercise 3" },
  // Add more exercises as needed
];

export default function AddCustomScreen() {
  const [selectedExercises, setSelectedExercises] = useState([]);
  const listRef = useRef(null);
  const navigation = useNavigation();

  const handleExerciseSelection = (exercise) => {
    // Toggle the selection state of the exercise
    setSelectedExercises((prevSelectedExercises) => {
      if (prevSelectedExercises.includes(exercise)) {
        return prevSelectedExercises.filter((item) => item !== exercise);
      } else {
        return [...prevSelectedExercises, exercise];
      }
    });
  };

  const handleCreateWorkoutPlan = () => {
    // Logic to add exxercise
    // Maybe need at least 3
    // basically save button
    console.log("Creating workout plan with selected exercises:", selectedExercises);
  };

  const addMoreExercise = () => {
    // min is 3 so ofc they can have more
    // exercise is hard code rn so not sure how to implement this
    console.log("Add more exercise");
  };

  return (
    <LinearBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Select Exercises</Text>
        {mockExercises.map((exercise, index) => (
          <Pressable
            key={index}
            style={[styles.exerciseItem, selectedExercises.includes(exercise) ? styles.selectedExercise : null]}
            onPress={() => handleExerciseSelection(exercise)}
          >
            <Text style={styles.exerciseName}>{exercise.name}</Text>
          </Pressable>
        ))}
        <Pressable style={styles.addExerciseButton} onPress={addMoreExercise }>
          <Text style={styles.addExerciseButtonText}>Add More Exercises</Text>
        </Pressable>
        <Pressable style={styles.saveButton} onPress={handleCreateWorkoutPlan}>
          <Text style={styles.saveButtonText}>Create</Text>
        </Pressable>
      </ScrollView>
    </LinearBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
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
    color: "white",
  },
  addExerciseButton: {
    backgroundColor: "teal",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  addExerciseButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "teal",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
