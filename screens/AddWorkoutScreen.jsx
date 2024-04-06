import { View, Text, StyleSheet, Pressable, Alert, TextInput } from "react-native";
import LinearBackground from "../components/LinearBackground";
import { useState } from "react";
import ExercisesSearchModal from "../components/ExercisesSearchModal";
import BackButton from "../components/BackButton";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
export default function AddWorkoutScreen({ navigation }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [workoutName, setWorkoutName] = useState(null);
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

  function handleCreateWorkout() {
    console.log("Creating workout plan")
  }

  return (
    <LinearBackground containerStyle={styles.container}>
      <BackButton handleOnPress={handleGoBack} />
      <View>
        <TextInput style={styles.workoutName} placeholder="Workout Name" placeholderTextColor="darkgrey" onChange={text => setWorkoutName(text)}/>
        <View style={styles.actionButtonsContainer}>
          <Pressable style={[styles.actionButton, { backgroundColor: "#aa3155"}]} onPress={handleGoBack} >
            <Text style={styles.actionButtonText}>Cancel</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, { backgroundColor: "#0087d6" }]}  onPress={handleCreateWorkout} >
            <Text style={styles.actionButtonText}>Save</Text>
          </Pressable>
        </View>

        {selectedExercises.map(exercise => {
          return (
            <></>
          )
        })}

        <Pressable style={styles.addExerciseButton} onPress={() => setModalVisible(true)} >
          <FontAwesome name="plus" color="white" size={23}/>
          <Text style={styles.addExerciseButtonText}>Add Exercise</Text>
        </Pressable>
        
        <ExercisesSearchModal isModalVisible={isModalVisible} setModalVisible={setModalVisible} containerStyle={{ backgroundColor: "midnightblue" }} />
      </View>
    </LinearBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: "5%",
    alignItems: "center"
  },
  workoutName: {
    color: "white",
    textAlign: "center",
    fontSize: 28,
    margin: 15
  },
  actionButtonsContainer: {
    flexDirection: "row",
    width: "100%"
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