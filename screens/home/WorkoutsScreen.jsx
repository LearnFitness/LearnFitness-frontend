import firestore from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Alert, ActivityIndicator } from "react-native";
import LinearBackground from "../../components/LinearBackground";
import { getBackendData } from "./../../utils/backendAPI";

function WorkoutPlan({ workout, onWorkoutPress }) {
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

const RecommendPlans = ({ onRecommendPress }) => {
  return (
    <View style={styles.recommendContainer}>
      <Text style={styles.recommendTitle}>Recommend For You</Text>
      <Pressable style={styles.recommendImageContainer} onPress={() => onRecommendPress({ id: 2, image: require("./../../assets/recommend1.jpg") })}>
        <Image
          source={require("./../../assets/recommend1.jpg")}
          style={styles.recommendImage}
        />
      </Pressable>
      {/* Add more recommended plans as needed */}
    </View>
  );
};

export default function WorkoutsScreen() {
  const [loading, setLoading] = useState(false);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    async function getWorkouts() {
      setLoading(true);
      try {
        const workouts = await getBackendData("/user/workouts");
        const premadeWorkoutsSnapshot = await firestore().collection("premade_workouts").get();
        setWorkouts(workouts);
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

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  return (
    <LinearBackground containerStyle={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Your Workouts</Text>
        <View style={styles.workoutsContainer}>
          {workouts.map((workout, index) => (
            <WorkoutPlan
              key={index}
              workout={workout}
              onWorkoutPress={handleWorkoutPress}
            />
          )
          )}
        </View>

        <Text style={styles.title}>Recommended for you</Text>
        <View style={styles.workoutsContainer}>
          {workouts.map((workout, index) => (
            <WorkoutPlan
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
    marginVertical: 20
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
    color: "white",
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
    borderRadius: 50,
    backgroundColor: "teal",
    justifyContent: "center",
    alignItems: "center",
  },

});
