import React, { useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView, Image, Platform, StatusBar} from "react-native";
import LinearBackground from "../../components/LinearBackground";

const WorkoutPlanItem = ({ workouts, onWorkoutPress }) => {
  return (
    <View style={styles.workoutPlanContainer}>
      {workouts.map((workout, index) => (
        <TouchableOpacity
          key={index}
          style={styles.workoutPlansContainer}
          onPress={() => onWorkoutPress(workout)}
        >
          <View style={styles.imageContainer}>
            <Image
              source={workout.image}
              style={styles.workoutImage}
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const RecommendPlans = ({ onRecommendPress }) => {
  return (
    <View style={styles.recommendContainer}>
      <Text style={styles.recommendTitle}>Recommend For You</Text>
      <TouchableOpacity style={styles.recommendImageContainer} onPress={() => onRecommendPress({ id: 2, image: require("./../../assets/recommend1.jpg") })}>
        <Image
          source={require("./../../assets/recommend1.jpg")}
          style={styles.recommendImage}
        />
      </TouchableOpacity>
      {/* Add more recommended plans as needed */}
    </View>
  );
};

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState([
    { id: 1, image: require("../../assets/workout1.jpg") },
    // Add more workout objects as needed
  ]);

  const handleWorkoutPress = (workout) => {
    console.log("Accessing workout:", workout);
    // Handle accessing the workout here, such as navigating to a detailed view
  };

  const handleAddWorkoutPlan = () => {
    console.log("Making your own workout plan");
    // Handle adding a workout plan
  };

  const handleRecommendPress = (workout) => {
    console.log("Accessing workout:", workout);
    // Handle accessing the workout here
  };

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  return (
    <LinearBackground>
      <SafeAreaView style={[styles.container, { paddingTop: statusBarHeight }]}>
        <View style={styles.content}>
          <Text style={styles.title}>My Workouts</Text>
          <ScrollView contentContainerStyle={styles.workoutScrollView}>
            <WorkoutPlanItem 
              workouts={workouts} 
              onWorkoutPress={handleWorkoutPress} 
            />
          </ScrollView>
          <TouchableOpacity style={styles.addButton} onPress={handleAddWorkoutPlan}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
          <RecommendPlans onRecommendPress={handleRecommendPress} />
        </View>
      </SafeAreaView>
    </LinearBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 70, // To accommodate the add button
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    marginTop: 20,
  },
  workoutScrollView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  workoutPlansContainer: {
    width: 150,
    height: 150,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
  },
  workoutImage: {
    width: 130,
    height: 130,
    borderRadius: 10,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  recommendContainer: {
    marginTop: 20,
  },
  recommendTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  recommendImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  recommendImage: {
    width: 130,
    height: 130,
    borderRadius: 10,
  },
});
