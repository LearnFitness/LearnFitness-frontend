import { View, ScrollView, Text, StyleSheet, Pressable, Alert, TextInput } from "react-native";
import LinearBackground from "../components/LinearBackground";
import { useState } from "react";
import ExercisesSearchModal from "../components/ExercisesSearchModal";
import BackButton from "../components/BackButton";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import ExerciseSets from "../components/ExerciseSets";
import { AddWorkoutContext } from "../context/AddWorkoutContext";

export default function AddWorkoutScreen({ navigation }) {
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [selectedExercises, setSelectedExercises] = useState([]);

  function handleGoBack() {
    Alert.alert(
      "Cancel editing this workout plan?",
      "You will lose all your changes",
      [
        {
          text: "Continue editing",
          style: "cancel"
        },
        {
          text: "Delete workout plan",
          style: "destructive",
          onPress: () => navigation.goBack()
        }
      ]
    )
  }

  function addExercise(exercise) {
    if (selectedExercises.findIndex(element => element.id === exercise.id) === -1)
      setSelectedExercises(prevData => [...prevData, exercise]);
    else throw Error("This exercise is already in the workout.");
  }

  function removeExercise(exerciseId) {
    setSelectedExercises(prevData => prevData.filter(exercise => exercise.id !== exerciseId));
  }

  function handleCreateWorkout() {
    console.log("Creating workout plan")
  }

  return (
    <AddWorkoutContext.Provider value={{ selectedExercises, addExercise }}>
      <LinearBackground containerStyle={styles.container}>
        <ScrollView>
          <BackButton handleOnPress={handleGoBack} />
          <View>
            <TextInput style={styles.workoutName} placeholder="Workout Name" placeholderTextColor="darkgrey" value={workoutName} onChangeText={text => setWorkoutName(text)} />
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
                  <FontAwesome name="square-xmark" color="#aa3155" size={22} style={{ position: "absolute", zIndex: 2, right: 15, top: 28 }} onPress={() => removeExercise(exercise.id)}/>               
                  <ExerciseSets exercise={exercise} />
                </View>
              )
            })}

            <Pressable style={styles.addExerciseButton} onPress={() => setSearchModalVisible(true)} >
              <FontAwesome name="plus" color="white" size={23} />
              <Text style={styles.addExerciseButtonText}>Add Exercise</Text>
            </Pressable>

            <ExercisesSearchModal isModalVisible={isSearchModalVisible} setModalVisible={setSearchModalVisible} />
          </View>
        </ScrollView>
      </LinearBackground>
    </AddWorkoutContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  },
  workoutName: {
    color: "white",
    textAlign: "center",
    fontSize: 28,
    margin: 15,
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