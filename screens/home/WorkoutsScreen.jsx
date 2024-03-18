import React, { useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import LinearBackground from "../../components/LinearBackground";

const WorkoutPlanItem = ({ workouts, onWorkoutPress, onAddWorkoutPlan }) => {
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
      <TouchableOpacity style={styles.addButtonContainer} onPress={onAddWorkoutPlan}>
        <View style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default function WorkoutsScreen() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [workouts, setWorkouts] = useState({
    Monday: [{ id: 1, image: require("../../assets/workout1.jpg") }],
    // Define workouts for other days as needed
  });

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleDaySelect = (day) => {
    setSelectedDay(day);
  };

  const handleWorkoutPress = (workout) => {
    console.log("Accessing workout:", workout);
    // Handle accessing the workout here, such as navigating to a detailed view
  };

  const handleAddWorkoutPlan = () => {
    if (selectedDay) {
      console.log("Adding a workout plan for:", selectedDay);
      // Handle adding a workout plan for the selected day
    }
  };

  return (
    <LinearBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>My Workouts</Text>
          <View style={styles.buttonSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.buttonContainer}
            >
              {daysOfWeek.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.dayButton, selectedDay === day && styles.selectedDayButton]}
                  onPress={() => handleDaySelect(day)}
                >
                  <Text style={[styles.dayButtonText, selectedDay === day && styles.selectedDayButtonText]}>{day}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          {selectedDay && workouts[selectedDay] && workouts[selectedDay].length > 0 ? (
            <WorkoutPlanItem 
              workouts={workouts[selectedDay]} 
              onWorkoutPress={handleWorkoutPress} 
              onAddWorkoutPlan={handleAddWorkoutPlan} 
            />
          ) : (
            <TouchableOpacity style={styles.addButtonContainer} onPress={handleAddWorkoutPlan}>
              <View style={styles.addButton}>
                <Text style={styles.addButtonText}>+</Text>
              </View>
            </TouchableOpacity>
          )}
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    marginTop: 20,
  },
  buttonSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  dayButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  selectedDayButton: {
    backgroundColor: "blue",
  },
  dayButtonText: {
    fontSize: 16,
    color: "white",
  },
  selectedDayButtonText: {
    fontWeight: "bold",
  },
  workoutPlanContainer: {
    marginTop: 10,
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
  addButtonContainer: {
    width: 150,
    height: 150,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 50,
    fontWeight: "bold",
  },
});
