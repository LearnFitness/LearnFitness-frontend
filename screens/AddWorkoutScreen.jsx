import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, StyleSheet, Alert, TextInput, TouchableOpacity } from "react-native";
import LinearBackground from "../components/LinearBackground";
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
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    if (exercise) {
      handleAddExercise(exercise);
    }
    if (workout) {
      setWorkoutId(workout.id);
      setWorkoutName(workout.name);
      setWorkoutDescription(workout.description);
      setExercises(workout.exercises);
    }
  }, [exercise, workout]);

  function handleGoBack() {
    if (!workoutName && exercises.length === 0) {
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

  function handleAddExercise(exercise) {
    const exerciseExists = exercises.some((ex) => ex.id === exercise.id);
    if (!exerciseExists) {
      const sets = workout ? exercise.sets : 1; // If modifying, use the existing sets value
      setExercises(prevExercises => [...prevExercises, { ...exercise, sets }]);
    } else {
      Alert.alert("Exercise already added to the workout.");
    }
  }

  function handleRemoveExercise(exerciseId) {
    setExercises(prevExercises => prevExercises.filter((ex) => ex.id !== exerciseId));
  }

  function handleAddSet(exerciseId) {
    const updatedExercises = exercises.map(ex => {
      if (ex.id === exerciseId) {
        return { ...ex, sets: ex.sets + 1 };
      }
      return ex;
    })
    setExercises(updatedExercises);
  };

  function handleRemoveSet(exerciseId) {
    const updatedExercises = exercises.map(ex => {
      if (ex.id === exerciseId && ex.sets > 1) {
        return { ...ex, sets: ex.sets - 1 };
      }
      return ex;
    })
    setExercises(updatedExercises);
  };

  async function handleSaveWorkout() {
    if (!workoutName.trim()) {
      Alert.alert("Workout name is required.");
      return;
    }
    if (exercises.length === 0) {
      Alert.alert("Please add exercises to your workout.");
      return;
    }

    try {
      const newWorkout = {
        name: workoutName,
        description: workoutDescription,
        exercises: exercises
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

        {exercises ?
          exercises.map((exercise) => (
            <View key={exercise.id}>
              <Ionicon
                name="close-circle-outline"
                color="#aa3155"
                size={23}
                style={{ position: "absolute", zIndex: 2, right: 15, top: 28 }}
                onPress={() => handleRemoveExercise(exercise.id)}
              />
              <ExerciseSets exercise={exercise} />
            </View>
          ))
          : null}

        <TouchableOpacity style={styles.addExerciseButton} onPress={() => navigation.navigate("ExercisesSearchModal")}>
          <FontAwesome name="plus" color="white" size={23} />
          <Text style={styles.addExerciseButtonText}>Add Exercise</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearBackground>
  );

  function ExerciseSets({ exercise }) {
    return (
      <View style={styles.setsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("ExerciseModal", { exerciseId: exercise.id })}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
        </TouchableOpacity>
        <Text style={styles.exerciseTarget}>{exercise.target}</Text>
        <View style={styles.exerciseHeader}>
          <Text style={[{ flex: 1, marginLeft: 15 }, styles.exerciseHeaderText]}>Set</Text>
          <Text style={[{ flex: 2 }, styles.exerciseHeaderText]}>lbs</Text>
          <Text style={[{ flex: 2 }, styles.exerciseHeaderText]}>Reps</Text>
        </View>
        <View>
          {[...Array(exercise.sets)].map((value, index) => {
            return <Set key={index} setIndex={index} exercise={exercise} />
          })}
        </View>
        <TouchableOpacity style={styles.addSetButton} onPress={() => handleAddSet(exercise.id)}>
          <Text style={styles.addSetButtonText}>+ Add Set</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function Set({ exercise, setIndex }) {
    return (
      <View style={styles.exerciseSet}>
        <Ionicon
          name="remove-circle-outline"
          color="#aa3155"
          size={17}
          onPress={() => handleRemoveSet(exercise.id)}
        />
        <Text style={{ flex: 1, textAlign: "center", fontSize: 15 }}>{setIndex + 1}</Text>
        <TextInput editable={false} style={[{ flex: 2 }, styles.exerciseInput]} />
        <TextInput editable={false} style={[{ flex: 2 }, styles.exerciseInput]} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  // AddWorkoutScreen
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
  },

  // Sets
  setsContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginTop: 15
  },
  exerciseName: {
    color: "blue",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    textTransform: "capitalize",
    marginBottom: 5,
    marginHorizontal: "5%"
  },
  exerciseTarget: {
    color: "grey",
    textAlign: "center",
    textTransform: "capitalize",
    marginBottom: 5
  },
  exerciseHeader: {
    flexDirection: "row",
  },
  exerciseHeaderText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    alignItems: "center"
  },
  exerciseSet: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5
  },
  exerciseInput: {
    textAlign: "center",
    backgroundColor: "rgb(245, 245, 245)",
    padding: 3,
    marginHorizontal: 3,
    borderRadius: 5,
    fontSize: 15
  },
  addSetButton: {
    alignSelf: "center",
    backgroundColor: "lightgrey",
    width: "40%",
    padding: 3,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5
  }
});
