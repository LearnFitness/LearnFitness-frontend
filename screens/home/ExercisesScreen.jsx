import { StyleSheet, Platform, StatusBar, View, Pressable, Modal, Alert, Text, SafeAreaView, TextInput, ScrollView } from "react-native";
import LinearBackground from "../../components/LinearBackground";
import ExercisesSearch from "../../components/ExercisesSearch";
import { AddWorkoutContext } from "../../context/AddWorkoutContext";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { useState } from "react";
import AddExerciseScreen from "../AddExerciseScreen";

const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

export default function ExercisesScreen({ navigation }) {
  const [isWorkoutsModalVisible, setWorkoutsModalVisible] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [exerciseToAdd, setExerciseToAdd] = useState(null);

  async function fetchAndDisplayWorkouts() {
    try {
      const workoutsSnapshot = await firestore().collection("users").doc(auth().currentUser.uid).collection("workouts").get();
      setWorkouts(workoutsSnapshot.docs);
    } catch (error) {
      Alert.alert(error.message);
    }
    setWorkoutsModalVisible(true);
  }

  async function handleAddExerciseRequest(exercise) {
    setExerciseToAdd({ ...exercise });
    await fetchAndDisplayWorkouts();
  }

  async function addExerciseToWorkout(workoutId, sets) {
    try {
      const workoutDocRef = await firestore().collection("users").doc(auth().currentUser.uid).collection("workouts").doc(workoutId).get();
      const existingExercises = workoutDocRef.data().exercises;
      const newExercise = { ...exerciseToAdd, sets }
      existingExercises.push(newExercise);

      await firestore().collection("users").doc(auth().currentUser.uid).collection("workouts").doc(workoutId).update({
        exercises: existingExercises
      })
      Alert.alert("Exercise added successfully.");
      setWorkoutsModalVisible(false);
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  return (
    <AddWorkoutContext.Provider value={{ addExercise: handleAddExerciseRequest }} >
      <LinearBackground containerStyle={styles.container}>
        <ExercisesSearch />
        <AddExerciseScreen exerciseToAdd={exerciseToAdd} workouts={workouts} isModalVisible={isWorkoutsModalVisible} setModalVisible={setWorkoutsModalVisible} addExerciseToWorkout={addExerciseToWorkout} />
      </LinearBackground>
    </AddWorkoutContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: "4%",
    paddingTop: statusBarHeight
  },
})
