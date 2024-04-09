import { StyleSheet, Modal, SafeAreaView, ScrollView, Text, Pressable, View, TextInput } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native"

export default function AddExerciseScreen({ exerciseToAdd, workouts, isModalVisible, setModalVisible, addExerciseToWorkout }) {
  const [sets, updateSets] = useState(3);
  const navigation = useNavigation();

  return (
    <Modal animationType="slide" presentationStyle="pageSheet" visible={isModalVisible} onRequestClose={() => setModalVisible(false)} >
      <SafeAreaView style={styles.workoutModalContainer}>
        <ScrollView>
          {workouts.length === 0 ?
            <>
              <Text style={styles.addWorkoutPrompt}>You have no workouts yet!</Text>
              <Text style={styles.addWorkoutSubPrompt}>Create a new workout first.</Text>
              <Pressable style={styles.addWorkoutButton} onPress={() => { setModalVisible(false); navigation.navigate("AddWorkoutScreen", { ...exerciseToAdd }) }}>
                <Text style={styles.addWorkoutButtonText}>Add a workout</Text>
              </Pressable>
            </>
            :
            <>
              <Text style={styles.addWorkoutPrompt}>{exerciseToAdd?.name}</Text>
              <Text style={styles.exerciseTarget}>{exerciseToAdd?.target}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", margin: 10, marginBottom: 20 }}>
                <TextInput style={styles.exerciseSet} value={sets ? sets.toString() : ""} onChangeText={text => text ? updateSets(parseInt(text, 10)) : updateSets(null)} keyboardType="numeric" />
                <Text style={styles.exerciseSetText}>sets</Text>
              </View>
              <Text style={styles.addWorkoutSubPrompt}>Choose a workout to add this exercise.</Text>
              {workouts.map(workout => {
                return (
                  <View key={workout.id} style={styles.workout}>
                    <Text style={styles.workoutName}>{workout.data().name}</Text>
                    <Pressable style={styles.addExerciseButton} onPress={() => addExerciseToWorkout(workout.id, sets)}>
                      <Text style={styles.addExerciseButtonText}>Add</Text>
                    </Pressable>
                  </View>
                )
              })}
            </>}

          <Pressable style={styles.cancleButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.cancleButtonText}>Cancel</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </Modal >
  )
}

const styles = StyleSheet.create({
  workoutModalContainer: {
    margin: 30
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
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 10
  },
  addExerciseButtonText: {
    fontSize: 18,
  },
  cancleButtonText: {
    fontSize: 20,
    color: "red",
    textAlign: "center",
    margin: 10
  }
})
