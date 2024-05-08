import { StyleSheet, ScrollView, Text, View, TextInput, Alert, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import Feather from "react-native-vector-icons/Feather";
import { Divider } from "@rneui/themed";
import toast from "../utils/toast";

function WorkoutItem({ exerciseToAdd, workout, sets }) {
  const [exerciseAdded, setExerciseAdded] = useState(false);

  useEffect(() => {
    if (workout.data().exercises.some(exercise => exercise.id === exerciseToAdd.id)) {
      setExerciseAdded(true);
    }
  }, []);

  async function handleAddExercise(workoutId) {
    try {
      const workoutDocRef = await firestore().collection("users").doc(auth().currentUser.uid).collection("workouts").doc(workoutId).get();
      const existingExercises = workoutDocRef.data().exercises;
      const newExercise = { ...exerciseToAdd, sets }
      existingExercises.push(newExercise);

      await firestore().collection("users").doc(auth().currentUser.uid).collection("workouts").doc(workoutId).update({
        exercises: existingExercises
      })

      setExerciseAdded(true);
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  return (
    <View style={[styles.workout, styles.shadow]}>
      <Text style={styles.workoutName}>{workout.data().name}</Text>
      <TouchableOpacity
        disabled={exerciseAdded}
        style={[styles.addExerciseButton, { backgroundColor: workout.data().added || exerciseAdded ? "#c1c1c1" : "teal" }]}
        onPress={() => handleAddExercise(workout.id)}
      >
        <Feather name={exerciseAdded ? "check" : "plus"} color="white" size={17} />
        <Text style={styles.addExerciseButtonText}>{exerciseAdded ? "Added" : "Add"}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function AddExerciseScreen({ route, navigation }) {
  const { exercise } = route.params;
  const [sets, updateSets] = useState(3);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        const workoutsSnapshot = await firestore().collection("users").doc(auth().currentUser.uid).collection("workouts").get();
        setWorkouts(workoutsSnapshot.docs);
      } catch (error) {
        Alert.alert(error.message);
      }
    }
    fetchWorkouts();
  }, [workouts]);

  function handlePlusSet() {
    updateSets(sets => sets + 1);
  }

  function handleMinusSet() {
    if (sets > 1) {
      updateSets(sets => sets - 1);
    } else {
      toast("At least 1 set is required");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Add exercise</Text>
      </View>
      <Divider />
      <ScrollView>
        {workouts.length === 0 ?
          <>
            <Text style={styles.addWorkoutPrompt}>You have no workouts yet!</Text>
            <Text style={styles.addWorkoutSubPrompt}>Create a new workout first.</Text>
            <TouchableOpacity
              style={styles.addWorkoutButton}
              onPress={() => {
                navigation.navigate("HomeNavigator", { screen: "Workouts" });
                navigation.navigate("AddWorkoutScreen", { exercise, action: "create", headerTitle: "Create workout" })
              }}
            >
              <Feather name={"plus"} color="white" size={17} />
              <Text style={styles.addWorkoutButtonText}>Add a workout</Text>
            </TouchableOpacity>
          </>
          :
          <>
            <Text style={styles.addWorkoutPrompt}>{exercise.name}</Text>
            <Text style={styles.exerciseTarget}>{exercise.target}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10 }}>
              <Feather name="minus" size={22} color="lightblue" onPress={handleMinusSet} />
              <TextInput style={styles.exerciseSet} value={sets ? sets.toString() : ""} onChangeText={text => text ? updateSets(parseInt(text, 10)) : updateSets(null)} keyboardType="numeric" />
              <Feather name="plus" size={22} color="lightblue" onPress={handlePlusSet} />
            </View>
            <Text style={styles.exerciseSetText}>sets</Text>
            <Text style={styles.addWorkoutSubPrompt}>Choose a workout to add this exercise</Text>
            {workouts.map(workout =>
              <WorkoutItem key={workout.id} workout={workout} exerciseToAdd={exercise} sets={sets} />
            )}
            <Divider style={{ marginHorizontal: 100, marginTop: 15, marginBottom: 5 }} />
            <Text style={styles.addWorkoutSubPrompt}>Or create a new workout with this exercise</Text>
            <TouchableOpacity
              style={[styles.addWorkoutButton, styles.shadow]}
              onPress={() => {
                navigation.navigate("HomeNavigator", { screen: "Workouts" });
                navigation.navigate("AddWorkoutScreen", { exercise, action: "create", headerTitle: "Create workout" })
              }}
            >
              <Feather name={"plus"} color="white" size={17} />
              <Text style={styles.addWorkoutButtonText}>Create workout</Text>
            </TouchableOpacity>
          </>
        }
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    backgroundColor: "white",
    flex: 1,
  },
  titleContainer: {

  },
  titleText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "500",
    margin: 10
  },
  workout: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    margin: 10,
    backgroundColor: "rgb(250,250,250)",
    borderRadius: 10,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: "500",
    maxWidth: "70%"
  },
  addWorkoutPrompt: {
    textAlign: "center",
    fontSize: 25,
    textTransform: "capitalize",
    fontWeight: "600",
    marginTop: 30,
    marginBottom: 5
  },
  addWorkoutSubPrompt: {
    textAlign: "center",
    fontSize: 18,
    marginVertical: 10
  },
  exerciseTarget: {
    color: "grey",
    textAlign: "center",
    fontSize: 18,
    textTransform: "capitalize"
  },
  exerciseSet: {
    textAlign: "center",
    width: "17%",
    backgroundColor: "rgb(245, 245, 245)",
    fontSize: 25,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 5
  },
  exerciseSetText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "500"
  },
  addWorkoutButton: {
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "teal",
    padding: 10,
    margin: 10,
    borderRadius: 10
  },
  addWorkoutButtonText: {
    marginLeft: 5,
    fontSize: 18,
    fontWeight: "600",
    color: "white"
  },
  addExerciseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10
  },
  addExerciseButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "500",
    marginLeft: 3
  },
  closeButtonText: {
    fontSize: 17,
    color: "#aa3155",
    fontWeight: "500",
    textAlign: "center",
    margin: 10,
    marginBottom: 30
  }
})