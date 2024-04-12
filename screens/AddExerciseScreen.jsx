import { StyleSheet, ScrollView, Text, View, TextInput, Alert, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export default function AddExerciseScreen({ route, navigation }) {
  const { exercise } = route.params;
  const [sets, updateSets] = useState(3);
  const [workouts, setWorkouts] = useState([]);
  const [exerciseAdded, setExerciseAdded] = useState(false);

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
  }, [])

  async function handleAddExercise(workoutId) {
    try {
      const workoutDocRef = await firestore().collection("users").doc(auth().currentUser.uid).collection("workouts").doc(workoutId).get();
      const existingExercises = workoutDocRef.data().exercises;
      const newExercise = { ...exercise, sets }
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
    <View style={styles.container}>
      <ScrollView>
        {workouts.length === 0 ?
          <>
            <Text style={styles.addWorkoutPrompt}>You have no workouts yet!</Text>
            <Text style={styles.addWorkoutSubPrompt}>Create a new workout first.</Text>
            <TouchableOpacity
              style={styles.addWorkoutButton}
              onPress={() => {
                navigation.navigate("HomeNavigator", { screen: "Workouts" });
                navigation.navigate("AddWorkoutScreen", { exerciseToAdd: exercise })
              }}
            >
              <Text style={styles.addWorkoutButtonText}>Add a workout</Text>
            </TouchableOpacity>
          </>
          :
          <>
            <Text style={styles.addWorkoutPrompt}>{exercise.name}</Text>
            <Text style={styles.exerciseTarget}>{exercise.target}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", margin: 10, marginBottom: 20 }}>
              <TextInput style={styles.exerciseSet} value={sets ? sets.toString() : ""} onChangeText={text => text ? updateSets(parseInt(text, 10)) : updateSets(null)} keyboardType="numeric" />
              <Text style={styles.exerciseSetText}>sets</Text>
            </View>
            <Text style={styles.addWorkoutSubPrompt}>Choose a workout to add this exercise.</Text>
            {workouts.map(workout => {
              if (workout.data().exercises.some(e => e.id === exercise.id)) {
                workout.data().added = true;
              }
              return (
                <View key={workout.id} style={styles.workout}>
                  <Text style={styles.workoutName}>{workout.data().name}</Text>
                  <TouchableOpacity
                    disabled={workout.data().added || exerciseAdded}
                    style={[styles.addExerciseButton, { backgroundColor: workout.data().added || exerciseAdded ? "darkgrey" : "teal" }]} onPress={() => handleAddExercise(workout.id)}
                  >
                    <Text style={styles.addExerciseButtonText}>{workout.data().added || exerciseAdded ? "Added" : "Add"}</Text>
                  </TouchableOpacity>
                </View>
              )
            })}
          </>}

        <TouchableOpacity style={styles.cancleButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancleButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: "white",
    flex: 1
  },
  workout: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    margin: 10,
    backgroundColor: "rgb(250,250,250)",
    borderRadius: 10,

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
    fontWeight: "500"
  },
  addWorkoutPrompt: {
    textAlign: "center",
    fontSize: 25,
    textTransform: "capitalize",
    fontWeight: "600",
    marginVertical: 10
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
    width: "20%",
    backgroundColor: "rgb(245, 245, 245)",
    fontSize: 25,
    padding: 10,
    borderRadius: 10
  },
  exerciseSetText: {
    fontSize: 18,
    margin: 5,
    fontWeight: "500"
  },
  addWorkoutButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "teal",
    padding: 10,
    margin: 10,
    borderRadius: 10
  },
  addWorkoutButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white"
  },
  addExerciseButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10
  },
  addExerciseButtonText: {
    fontSize: 18,
    color: "white"
  },
  cancleButtonText: {
    fontSize: 20,
    color: "red",
    textAlign: "center",
    margin: 10
  }
})