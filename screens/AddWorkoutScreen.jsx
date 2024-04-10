import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, StyleSheet, Pressable, Alert, TextInput } from "react-native";
import LinearBackground from "../components/LinearBackground";
import { AddWorkoutContext } from "../context/AddWorkoutContext";
import ExerciseSets from "../components/ExerciseSets";
import ExercisesSearchModal from "../components/ExercisesSearchModal";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export default function AddWorkoutScreen({ route, navigation }) {
  const { workout } = route.params || {};
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [workoutName, setWorkoutName] = useState(workout ? workout.name : "");
  const [workoutDescription, setWorkoutDescription] = useState(workout ? workout.description : "");
  const [selectedExercises, setSelectedExercises] = useState(workout ? workout.exercises : []);

  function handleGoBack() {
    if (!workoutName && selectedExercises.length === 0) {
      navigation.goBack();
    } else {
      Alert.alert(
        "Discard workout plan?",
        "You will lose all your changes.",
        [
          {
            text: "Keep editing",
            style: "cancel"
          },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => navigation.goBack()
          }
        ]
      )
    }
  }

  function addExercise(exercise) {
    const exerciseExists = selectedExercises.some((ex) => ex.id === exercise.id);
    if (!exerciseExists) {
      setSelectedExercises((prevExercises) => [...prevExercises, { ...exercise, sets: 1 }]);
    } else {
      Alert.alert("Exercise already added to the workout.");
    }
  }

  function removeExercise(exerciseId) {
    setSelectedExercises((prevExercises) => prevExercises.filter((ex) => ex.id !== exerciseId));
  }

  async function handleCreateWorkout() {
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

      if (workout) {
        // Update existing workout
        await firestore().collection("users").doc(auth().currentUser.uid).collection("workouts").doc(workout.id).update(newWorkout);
      } else {
        // Create new workout
        await firestore().collection("users").doc(auth().currentUser.uid).collection("workouts").add(newWorkout);
      }

      Alert.alert(workout ? "Workout updated successfully." : "Workout created successfully.");
      navigation.goBack();
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  useEffect(() => {
    if (workout) {
      setWorkoutName(workout.name);
      setWorkoutDescription(workout.description);
      setSelectedExercises(workout.exercises);
    }
  }, [workout]);

  return (
    <AddWorkoutContext.Provider value={{ selectedExercises, addExercise }}>
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
            <Pressable style={[styles.actionButton, { backgroundColor: "#aa3155" }]} onPress={handleGoBack}>
              <Text style={styles.actionButtonText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.actionButton, { backgroundColor: "#0087d6" }]} onPress={handleCreateWorkout}>
              <Text style={styles.actionButtonText}>{workout ? "Update" : "Save"}</Text>
            </Pressable>
          </View>

          {selectedExercises.map((exercise) => (
            <View key={exercise.id}>
              <FontAwesome
                name="square-xmark"
                color="#aa3155"
                size={23}
                style={{ position: "absolute", zIndex: 2, right: 15, top: 28 }}
                onPress={() => removeExercise(exercise.id)}
              />
              <ExerciseSets exercise={exercise} />
            </View>
          ))}

          <Pressable style={styles.addExerciseButton} onPress={() => setSearchModalVisible(true)}>
            <FontAwesome name="plus" color="white" size={23} />
            <Text style={styles.addExerciseButtonText}>Add Exercise</Text>
          </Pressable>
          <ExercisesSearchModal isModalVisible={isSearchModalVisible} setModalVisible={setSearchModalVisible} />
        </ScrollView>
      </LinearBackground>
    </AddWorkoutContext.Provider>
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
