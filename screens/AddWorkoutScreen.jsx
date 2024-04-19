import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, StyleSheet, Alert, TextInput, TouchableOpacity } from "react-native";
import LinearBackground from "../components/LinearBackground";
import ExerciseSets from "../components/ExerciseSets";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import Ionicon from "react-native-vector-icons/Ionicons";
import toast from "../utils/toast";

export default function AddWorkoutScreen({ route, navigation }) {
  const { workout, exercise, action } = route.params ? route.params : {};
  const [workoutId, setWorkoutId] = useState("");
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [selectedExercises, setSelectedExercises] = useState([]);

  useEffect(() => {
    if (exercise) {
      addExercise(exercise);
    }
    if (workout) {
      setWorkoutId(workout.id);
      setWorkoutName(workout.name);
      setWorkoutDescription(workout.description);
      setSelectedExercises(workout.exercises);
    }
  }, [exercise, workout]);

  function handleGoBack() {
    if (!workoutName && selectedExercises.length === 0) {
      navigation.goBack();
    } else {
      Alert.alert(
        "Discard changes?",
        "Any unsaved changes will be lost.",
        [
          {
            text: "Keep editing",
            style: "cancel",
            onPress: () => { }
          },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => navigation.goBack()
          }
        ],
        { cancelable: true }
      )
    }
  }

  function addExercise(exercise) {
    const exerciseExists = selectedExercises.some((ex) => ex.id === exercise.id);
    if (!exerciseExists) {
      const initialSets = workout ? exercise.sets : 1; // If modifying, use the existing sets value
      setSelectedExercises((prevExercises) => [...prevExercises, { ...exercise, sets: initialSets }]);
    } else {
      Alert.alert("Exercise already added to the workout.");
    }
  }

  function removeExercise(exerciseId) {
    setSelectedExercises((prevExercises) => prevExercises.filter((ex) => ex.id !== exerciseId));
  }

  async function handleSaveWorkout() {
    if (!workoutName.trim()) {
      Alert.alert("Workout name is required.");
      return;
    }
    if (selectedExercises.length === 0) {
      Alert.alert("Please add exercises to your workout.");
      return;
    }

    try {
      const newWorkout = {
        name: workoutName,
        description: workoutDescription,
        exercises: selectedExercises
      };

      if (action === "edit") {
        // Update existing workout
        await firestore().collection("users").doc(auth().currentUser.uid).collection("workouts").doc(workoutId).update(newWorkout);
        toast("Workout updated");
      } else if (action === "create") {
        // Create new workout
        await firestore().collection("users").doc(auth().currentUser.uid).collection("workouts").add(newWorkout);
        toast("Workout created");
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  return (
    <LinearBackground containerStyle={styles.container}>
      <ScrollView>
        <TextInput
          style={styles.workoutName}
          placeholder="Workout name"
          placeholderTextColor="darkgrey"
          value={workoutName}
          onChangeText={setWorkoutName}
        />
        <TextInput
          style={styles.workoutDescription}
          placeholder="Workout description"
          placeholderTextColor="darkgrey"
          value={workoutDescription}
          onChangeText={setWorkoutDescription}
        />

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#aa3155" }]} onPress={handleGoBack}>
            <Text style={styles.actionButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#0087d6" }]} onPress={handleSaveWorkout}>
            <Text style={styles.actionButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        {selectedExercises.map((exercise) => (
          <View key={exercise.id}>
            <Ionicon
              name="close-circle-outline"
              color="#aa3155"
              size={23}
              style={{ position: "absolute", zIndex: 2, right: 15, top: 28 }}
              onPress={() => removeExercise(exercise.id)}
            />
            <ExerciseSets exercise={exercise} />
          </View>
        ))}

        <TouchableOpacity style={styles.addExerciseButton} onPress={() => navigation.navigate("ExercisesSearchModal")}>
          <FontAwesome name="plus" color="white" size={23} />
          <Text style={styles.addExerciseButtonText}>Add Exercise</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: "5%"
  },
  workoutName: {
    color: "white",
    textAlign: "center",
    fontSize: 28,
    fontWeight: "600",
    marginTop: 20
  },
  workoutDescription: {
    color: "lightgrey",
    textAlign: "center",
    fontSize: 18,
    marginVertical: 10
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  actionButton: {
    width: "40%",
    height: 35,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  },
  actionButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600"
  },
  addExerciseButton: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10
  },
  addExerciseButtonText: {
    color: "darkgrey",
    fontSize: 17,
    margin: 5
  }
});
