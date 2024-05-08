import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, Text, StyleSheet, Alert, TextInput, TouchableOpacity, Platform, Image } from "react-native";
import LinearBackground from "../components/LinearBackground";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import Ionicon from "react-native-vector-icons/Ionicons";
import toast from "../utils/toast";
import { useHeaderHeight } from "@react-navigation/elements";
import storage from "@react-native-firebase/storage";

export default function AddWorkoutScreen({ route, navigation }) {
  const { workout, exercise, image, action } = route.params ? route.params : {};
  const [workoutImage, setWorkoutImage] = useState(null);
  const [workoutId, setWorkoutId] = useState("");
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [exercises, setExercises] = useState([]);
  const scrollYRef = useRef(0);  // Using useRef to hold the current scroll position
  const headerHeight = useHeaderHeight();

  // const geturl = async () => {
  //   const url = await storage().ref("/workoutImages/back.png").getDownloadURL();
  //   console.log(url);
  // }
  // geturl();

  const handleScroll = (event) => {
    const newY = event.nativeEvent.contentOffset.y;
    scrollYRef.current = newY;  // Update ref value with new scroll position

    const headerTitle = action === "edit" ? "Edit workout" : "Create workout";
    // Update title based on current scroll position without causing re-renders
    if (newY > 130) {
      navigation.setOptions({
        title: workoutName.trim() ? workoutName : headerTitle,
        headerLeft: () => <Ionicon name="chevron-back" color="lightblue" size={23} onPress={handleGoBack} />,
        headerRight: () => (
          <TouchableOpacity style={{ backgroundColor: "rgb(0,135,214)", paddingVertical: 5, paddingHorizontal: 15, borderRadius: 5 }} onPress={handleSaveWorkout}>
            <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>Save</Text>
          </TouchableOpacity>
        )
      });
    } else {
      navigation.setOptions({ title: headerTitle, headerLeft: null, headerRight: null });
    }
  };

  useEffect(() => {
    if (exercise) {
      handleAddExercise(exercise);
    }
    if (workout) {
      setWorkoutId(workout.id);
      setWorkoutName(workout.name);
      setWorkoutDescription(workout.description);
      setExercises(workout.exercises);
      setWorkoutImage({ data: { url: workout.imgUrl } })
    }
    if (image) {
      setWorkoutImage(image);
    }
  }, [exercise, workout, image]);

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
      const sets = exercise.sets ? exercise.sets : 1; // If modifying, use the existing sets value
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
        exercises: exercises,
        imgUrl: workoutImage.data.url
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
    <LinearBackground containerStyle={{ paddingHorizontal: "5%" }} safeAreaView={false}>
      <ScrollView onScroll={handleScroll} scrollEventThrottle={15} style={{ paddingTop: Platform.OS === 'ios' ? headerHeight : 0 }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("WorkoutImagePicker")}>
          <Image
            source={workoutImage ? { uri: workoutImage.data.url } : require("./../assets/workout_plans_images/leg1.jpg")}
            style={{ alignSelf: "center", width: 150, height: 150, margin: 15, borderRadius: 5 }}
          />
        </TouchableOpacity>

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

        <TouchableOpacity style={[styles.addExerciseButton, { marginBottom: headerHeight + 30 }]} onPress={() => navigation.navigate("ExercisesSearchModal")}>
          <FontAwesome name="plus" color="darkgrey" size={23} />
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
  workoutName: {
    color: "white",
    textAlign: "center",
    fontSize: 28,
    fontWeight: "600",
    marginTop: 10
  },
  workoutDescription: {
    color: "grey",
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
    marginBottom: 30,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10
  },
  addExerciseButtonText: {
    color: "darkgrey",
    fontSize: 17,
    margin: 5,
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
