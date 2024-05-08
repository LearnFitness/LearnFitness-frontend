import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import { Divider } from "@rneui/themed";
import { useState } from "react";
import { useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import Feather from "react-native-vector-icons/Feather";
import YoutubePlayer from "react-native-youtube-iframe";
import axios from "axios";

export default function ExerciseModal({ route, navigation }) {
  const [exercise, setExercise] = useState({});
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const exerciseId = route.params.exerciseId;

  useEffect(() => {
    async function fetchExercise() {
      try {
        const exercise = await firestore().collection("exercises").doc(exerciseId).get();
        const PR = await firestore().collection("users").doc(auth().currentUser.uid).collection("PRs").doc(exerciseId).get();
        setExercise({ ...exercise.data(), PR: PR ? PR.data() : null });
        setLoading(false);
        const res = await axios.get(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyB7YEQGU5t822OQfJAi-vq169iW1lIR2Pc&part=id&q=${exercise.data().name + " exercise"}`);
        if (res.data.pageInfo.totalResults > 0) {
          setVideoId(res.data.items[0].id.videoId);
        }
      } catch (error) {
        Alert.alert(error.message);
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
      const parentScreen = routes.find(route => route.name === "StartWorkoutScreen");
      const action = parentScreen.params.action; // action is either edit or start
      navigation.navigate("StartWorkoutScreen", { exercise, headerTitle: action === "edit" ? "Edit completed workout" : "Start workout", action });
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
              <Feather name="plus" color="white" size={18} />
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

            <View style={styles.PRContainer}>
              <Text style={styles.exerciseKey}>Your PR</Text>
              <View style={{ backgroundColor: "rgba(0,128,128,0.07)", padding: 7, borderRadius: 10 }}>
                <Text style={styles.PRValue}>
                  {exercise?.PR ? `${exercise.PR.lbs} lbs x ${exercise.PR.reps}` : "-"}
                </Text>
              </View>
            </View>

            <View style={{ marginBottom: 30 }}>
              <Divider style={{ padding: 10 }} />
              <Text style={styles.instructions}>Instructions</Text>
              <View style={{ alignSelf: "center" }}>
                {videoId ?
                  <YoutubePlayer
                    height={200}
                    width={350}
                    play={false}
                    mute={true}
                    videoId={videoId}
                  /> : null
                }
              </View>
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
    paddingTop: 20,
    paddingHorizontal: 20,
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
  PRContainer: {

  },
  PRValue: {
    textAlign: "center",
    color: "teal",
    fontSize: 20,
    fontWeight: "600"
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
    marginTop: 15,
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "teal",
    borderRadius: 10,
    padding: 10
  },
  addToWorkoutButtonText: {
    fontSize: 17,
    color: "white",
    fontWeight: "500",
    marginLeft: 5
  },
  closeButtonText: {
    fontSize: 17,
    color: "#aa3155",
    fontWeight: "500"
  }
})