import firestore from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Alert, ActivityIndicator } from "react-native";
import LinearBackground from "../../components/LinearBackground";
import { getBackendData } from "./../../utils/backendAPI";

function Workout({ workout, onWorkoutPress }) {
  return (
    <View style={styles.workoutPlanContainer}>
      <Pressable onPress={() => onWorkoutPress(workout)}>
        <Image source={require("./../../assets/workout_plans_images/leg1.jpg")} style={styles.workoutImage} />
        <View style={{ padding: 10 }}>
          <Text style={styles.workoutName}>{workout.name}</Text>
          <Text style={styles.workoutDescription}>{workout.description}</Text>
          {workout.exercises.map(exercise => (
            <Text key={exercise.id} style={styles.exerciseName}>{exercise.sets + " x " + exercise.name}</Text>
          ))
          }
        </View>
      </Pressable>
    </View>
  );
};

export default function WorkoutsScreen() {
  const [loading, setLoading] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [recommendedWorkouts, setRecommendedWorkouts] = useState([]);

  useEffect(() => {
    async function getWorkouts() {
      setLoading(true);
      try {
        const userData = await getBackendData("user");
        const workouts = await getBackendData("user/workouts");
        const premadeWorkoutsSnapshot = await firestore().collection("premade_workouts").where("expLevel", "==", userData.expLevel.toLowerCase()).get();

        let recommendedWorkoutsArray = [];
        premadeWorkoutsSnapshot.forEach((workout) => {
          recommendedWorkoutsArray.push(workout.data());
        })

        setWorkouts(workouts);
        setRecommendedWorkouts(recommendedWorkoutsArray);
      } catch (error) {
        Alert.alert(error.message);
      } finally {
        setLoading(false);
      }
    }
    getWorkouts();
  }, []);

  const handleWorkoutPress = (workout) => {
    console.log("Accessing workout:", workout);
    // Handle accessing the workout here, such as navigating to a detailed view
  };

  const handleAddWorkoutPlan = () => {
    console.log("Making your own workout plan");
    // Handle adding a workout plan
  };

  if (loading) return (
    <LinearBackground>
      <ActivityIndicator style={{ flex: 1 }} />
    </LinearBackground>
  )

  return (
    <LinearBackground containerStyle={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Your Workouts</Text>
        <View style={styles.workoutsContainer}>
          {workouts.length === 0 ? <Text style={{ color: "darkgrey", fontSize: 17 }}>You have no workouts yet</Text> :
            workouts.map((workout, index) => (
              <Workout
                key={index}
                workout={workout}
                onWorkoutPress={handleWorkoutPress}
              />
            )
            )}
        </View>

        <Text style={styles.title}>Recommended for you</Text>
        <View style={styles.workoutsContainer}>
          {recommendedWorkouts.length === 0 ? <Text style={{ color: "darkgrey", fontSize: 17 }}>No recommendations available</Text> :
            recommendedWorkouts.map((workout, index) => (
              <Workout
                key={index}
                workout={workout}
                onWorkoutPress={handleWorkoutPress}
              />
            )
            )}
        </View>

      </ScrollView>


      <Pressable style={styles.addButton} onPress={handleAddWorkoutPlan}>
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>

    </LinearBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: "6%"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 45,
    marginBottom: 10
  },
  workoutsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  workoutPlanContainer: {
    width: "47%",
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
  workoutImage: {
    width: '100%',
    height: 170,
    alignSelf: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  workoutDescription: {
    color: "darkgrey",
    fontStyle: "italic",
    marginBottom: 10
  },
  addButtonText: {
    color: "rgba(0, 0, 0, 0.25)",
    fontSize: 30,
    fontWeight: "bold",
  },
  workoutName: {
    fontSize: 18,
    fontWeight: "700"
  },
  exerciseName: {
    fontSize: 15
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 0,
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
});
