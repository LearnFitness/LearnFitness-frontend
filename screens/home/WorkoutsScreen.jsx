import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Alert, ActivityIndicator, Modal } from "react-native";
import LinearBackground from "../../components/LinearBackground";
import { getBackendData } from "./../../utils/backendAPI";
import { useFocusEffect } from '@react-navigation/native';

export default function WorkoutsScreen({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [recommendedWorkouts, setRecommendedWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  async function getWorkoutsAsync() {
    setLoading(true);
    try {
      const userDocRef = await firestore().collection("users").doc(auth().currentUser.uid).get();
      const userExp = userDocRef.data().expLevel;
      const workouts = await getBackendData("user/workouts");
      const premadeWorkoutsSnapshot = await firestore().collection("premade_workouts").where("expLevel", "==", userExp.toLowerCase()).get();

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

  useEffect(() => {
    async function getWorkouts() {
      await getWorkoutsAsync();
    }
    getWorkouts();
  }, []);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .collection("workouts")
      .onSnapshot(() => {
        async function getWorkouts() {
          await getWorkoutsAsync();
        }
        getWorkouts();
      });

    // Stop listening for updates when no longer required
    return () => unsubscribe();
  }, []);

  const handleWorkoutPress = (workout) => {
    setSelectedWorkout(workout);
  };

  const handleAddWorkoutPlan = () => {
    navigation.navigate("AddWorkoutScreen");
  };

  return (
    <LinearBackground containerStyle={styles.container}>
      {loading ? <ActivityIndicator style={{ flex: 1 }} />
        : (
          <>
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
              <Text style={styles.title}>Your Workouts</Text>
              <View style={styles.workoutsContainer}>
                {workouts.length === 0 ? <Text style={{ color: "darkgrey", fontSize: 17 }}>You have no workouts yet</Text> :
                  workouts.map((workout, index) => (
                    <WorkoutItem
                      key={index}
                      workout={workout}
                      onPress={handleWorkoutPress}
                    />
                  )
                  )}
              </View>

              <Text style={styles.title}>Recommended for you</Text>
              <View style={styles.workoutsContainer}>
                {recommendedWorkouts.length === 0 ? <Text style={{ color: "darkgrey", fontSize: 17 }}>No recommendations available</Text> :
                  recommendedWorkouts.map((workout, index) => (
                    <WorkoutItem
                      key={index}
                      workout={workout}
                      onPress={handleWorkoutPress}
                    />
                  )
                  )}
              </View>

            </ScrollView>
            <Pressable style={styles.addButton} onPress={handleAddWorkoutPlan}>
              <Text style={styles.addButtonText}>+</Text>
            </Pressable>

            {selectedWorkout && (
              <WorkoutDetailsModal
                workout={selectedWorkout}
                onClose={() => setSelectedWorkout(null)}
              />
            )}
          </>
        )}

    </LinearBackground>
  );
}

const WorkoutDetailsModal = ({ workout, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalContainer} onPress={onClose}>
        <View style={styles.modalContent}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={{ color: "blue" }}>Close</Text>
          </Pressable>
          <Text style={styles.modalHeader}>Workout Summary</Text>
          <Text style={styles.workoutName}>{workout.name}</Text>
          {workout.exercises.map((exercise, index) => (
            <Text key={index}>• {exercise.sets} x {exercise.name}</Text>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
};


const WorkoutItem = ({ workout, onPress }) => {
  return (
    <View style={styles.workoutItemContainer}>
      <Image source={require("./../../assets/workout_plans_images/leg1.jpg")} style={styles.workoutImage} />
      <View style={styles.workoutDetailsContainer}>
        <Text style={styles.workoutName}>{workout.name}</Text>
        <Pressable onPress={() => onPress(workout)} style={styles.showMoreButton}>
          <Text style={{ color: "blue" }}>Quick View → </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: "6%"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 25,
    marginBottom: 10
  },
  workoutsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  workoutItemContainer: {
    overflow: "hidden",
    width: "47%",
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 1)",
    marginBottom: 10
  },
  workoutImage: {
    width: '100%',
    height: 170,
    alignSelf: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  workoutDetailsContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10
  },
  workoutName: {
    fontSize: 18,
    fontWeight: "700"
  },
  showMoreButton: {
    paddingVertical: 5,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 0,
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "teal"
  },
  addButtonText: {
    color: "rgba(0, 0, 0, 0.3)",
    fontSize: 30,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
