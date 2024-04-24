import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import { Divider } from "@rneui/themed";
import { useState } from "react";
import { useEffect } from "react";
import firestore from "@react-native-firebase/firestore";

export default function ExerciseModal({ route, navigation }) {
  const [exercise, setExercise] = useState([]);
  const [loading, setLoading] = useState(true);
  const exerciseId = route.params.exerciseId;

  useEffect(() => {
    async function fetchExercise() {
      try {
        const exercise = await firestore().collection("exercises").doc(exerciseId).get();
        setExercise(exercise.data());
      } catch (error) {
        Alert.alert(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchExercise();
  }, [exerciseId]);

  function handleAddExercise() {
    // Check who called this screen and delegate the add exercise functionality accordingly
    const routes = navigation.getState().routes;

    if (routes.find(route => route.name === "AddWorkoutScreen")) {
      const parentScreen = routes.find(route => route.name === "AddWorkoutScreen");
      const action = parentScreen.params.action; // action is either edit or create
      navigation.navigate("AddWorkoutScreen", { exercise, headerTitle: action === "edit" ? "Edit workout" : "Create workout", action });
    } else if (routes.find(route => route.name === "StartWorkoutScreen")) {
      navigation.navigate("StartWorkoutScreen", { exercise });
    } else {
      navigation.navigate("AddExerciseScreen", { exercise });
    };
  }

  return (
    <View style={styles.container}>
      {loading || !exercise ? <ActivityIndicator style={{ flex: 1 }} /> :
        <>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.addToWorkoutButton} onPress={handleAddExercise}>
              <Text style={styles.addToWorkoutButtonText}>Add to Workout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()} >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
          <Divider style={{ width: "100%", padding: 10 }} />
          <ScrollView contentContainerStyle={styles.exerciseContainer}>
            <Text style={styles.exerciseName}>{exercise?.name}</Text>
            <FastImage style={styles.exerciseGif} source={{ uri: exercise?.gifUrl }} />

            <View style={styles.keyValueRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.exerciseKey}>Body Part</Text>
                <Text style={styles.exerciseValue}>{exercise?.bodyPart}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.exerciseKey}>Equipment</Text>
                <Text style={styles.exerciseValue}>{exercise?.equipment}</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.exerciseKey}>Target Muscle</Text>
                <Text style={styles.exerciseValue}>{exercise?.target}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.exerciseKey}>Secondary Muscles</Text>
                <View style={styles.exerciseValue}>
                  {exercise?.secondaryMuscles.map((muscle, index) => {
                    return <Text key={index} style={styles.exerciseValue}>{muscle}</Text>
                  })}
                </View>
              </View>
            </View>
            <View>
              <Divider style={{ padding: 10 }} />
              <Text style={styles.instructions}>Instructions</Text>
              {exercise?.instructions.map((instruction, index) => {
                return <Text style={styles.instructionStep} key={index}>{(index + 1) + ". " + instruction}</Text>
              })}
            </View>
          </ScrollView>
        </>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    flex: 1,
    backgroundColor: "white"
  },
  exerciseContainer: {
    alignItems: "center",
    marginVertical: 10
  },
  exerciseName: {
    fontSize: 25,
    fontWeight: "600",
    textAlign: "center",
    textTransform: "capitalize"
  },
  exerciseGif: {
    width: 250,
    height: 250,
  },
  keyValueRow: {
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  exerciseKey: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "300",
    color: "darkgrey",
    marginTop: 20,
    marginBottom: 5
  },
  exerciseValue: {
    textAlign: "center",
    fontSize: 20,
  },
  instructions: {
    margin: 10,
    fontSize: 22,
    fontWeight: "600"
  },
  instructionStep: {
    margin: 10,
    fontSize: 17,
    color: "darkgrey"
  },
  buttonsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addToWorkoutButton: {
    backgroundColor: "teal",
    borderRadius: 10,
    padding: 10
  },
  addToWorkoutButtonText: {
    fontSize: 17,
    color: "white",
  },
  closeButtonText: {
    fontSize: 17,
    color: "#aa3155"
  }
})