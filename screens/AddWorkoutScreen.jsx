import { View, ScrollView, Text, StyleSheet, Pressable, Alert, TextInput } from "react-native";
import LinearBackground from "../components/LinearBackground";
import { useState } from "react";
import ExercisesSearchModal from "../components/ExercisesSearchModal";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import ExerciseSets from "../components/ExerciseSets";
import { AddWorkoutContext } from "../context/AddWorkoutContext";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export default function AddWorkoutScreen({ route, navigation }) {
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [selectedExercises, setSelectedExercises] = useState(() => {
    if (route.params) {
      return [{ ...route.params, sets: 1 }];
    } else return [];
  })

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
    if (selectedExercises.findIndex(element => element.id === exercise.id) === -1)
      setSelectedExercises(prevData => [...prevData, { ...exercise, sets: 1 }]);
    else throw Error("This exercise is already in the workout.");
  }

  function removeExercise(exerciseId) {
    setSelectedExercises(prevData => prevData.filter(exercise => exercise.id !== exerciseId));
  }

  async function handleCreateWorkout() {
    if (!workoutName) {
      Alert.alert("Workout name required!");
      return;
    }
    if (selectedExercises.length === 0) {
      Alert.alert("Empty workout not allowed!");
      return;
    }

    try {
      await firestore().collection("users").doc(auth().currentUser.uid).collection("workouts").add({
        name: workoutName,
        description: workoutDescription,
        exercises: selectedExercises
      })
      Alert.alert("Workout created successfully");
      navigation.goBack();
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  return (
    <AddWorkoutContext.Provider value={{ selectedExercises, addExercise }}>
      <LinearBackground containerStyle={styles.container}>
        <ScrollView>
          <TextInput style={styles.workoutName} placeholder="Workout name" placeholderTextColor="darkgrey" value={workoutName} onChangeText={text => setWorkoutName(text)} />
          <TextInput style={styles.workoutDescription} placeholder="Workout description" placeholderTextColor="darkgrey" value={workoutDescription} onChangeText={text => setWorkoutDescription(text)} />
          <View style={styles.actionButtonsContainer}>
            <Pressable style={[styles.actionButton, { backgroundColor: "#aa3155" }]} onPress={handleGoBack} >
              <Text style={styles.actionButtonText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.actionButton, { backgroundColor: "#0087d6" }]} onPress={handleCreateWorkout} >
              <Text style={styles.actionButtonText}>Save</Text>
            </Pressable>
          </View>

          {selectedExercises.map(exercise => {
            return (
              <View key={exercise.id}>
                <FontAwesome name="square-xmark" color="#aa3155" size={23} style={{ position: "absolute", zIndex: 2, right: 15, top: 28 }} onPress={() => removeExercise(exercise.id)} />
                <ExerciseSets exercise={exercise} />
              </View>
            )
          })}

          <Pressable style={styles.addExerciseButton} onPress={() => setSearchModalVisible(true)} >
            <FontAwesome name="plus" color="white" size={23} />
            <Text style={styles.addExerciseButtonText}>Add Exercise</Text>
          </Pressable>
          <ExercisesSearchModal isModalVisible={isSearchModalVisible} setModalVisible={setSearchModalVisible} />
        </ScrollView>
      </LinearBackground>
    </AddWorkoutContext.Provider>
  )
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
    marginTop: 20,
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
})