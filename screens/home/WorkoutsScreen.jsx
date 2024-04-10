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

  const handleWorkoutPress = (workout, isModify = false) => {
    if (isModify) {
      navigation.navigate("AddWorkoutScreen", { workout }); // Navigate to AddWorkoutScreen with workout data
    } else {
      setSelectedWorkout(workout);
    }
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
                      isYourWorkout={true}
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
                navigation={navigation}
              />
            )}
          </>
        )}

    </LinearBackground>
  );
}

const WorkoutDetailsModal = ({ workout, onClose, navigation }) => {
  const handleModifyWorkout = () => {
    onClose(); 
    navigation.navigate("AddWorkoutScreen", { workout });
  };

  const handleDeleteWorkout = async () => {
    try {
      await firestore()
        .collection('users')
        .doc(auth().currentUser.uid)
        .collection('workouts')
        .doc(workout.id) 
        .delete();
      onClose(); 
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

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
          <View style={styles.buttonsContainer}>
            <Pressable onPress={handleModifyWorkout} style={[styles.button, styles.modifyButton]}>
              <Text style={{ color: "blue" }}>Modify</Text>
            </Pressable>
            <Pressable onPress={handleDeleteWorkout} style={[styles.button, styles.deleteButton]}>
              <Text style={{ color: "red" }}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};


const WorkoutItem = ({ workout, onPress, isYourWorkout }) => {
  const handleQuickView = () => {
    onPress(workout); 
  };

  const generateBriefDescription = () => {
    if (workout.exercises.length === 0) {
      return "No exercises available";
    } else if (workout.exercises.length === 1) {
      return `• ${workout.exercises[0].sets} x ${workout.exercises[0].name}`;
    } else {
      const firstTwoExercises = workout.exercises.slice(0, 2).map(exercise => `• ${exercise.sets} x ${exercise.name}`);
      return `${firstTwoExercises.join("\n")} \n...`;
    }
  };

  return (
    <View style={styles.workoutItemContainer}>
      <Pressable onPress={handleQuickView}>
        <Image source={require("./../../assets/workout_plans_images/leg1.jpg")} style={styles.workoutImage} />
        <View style={styles.workoutDetailsContainer}>
          <Text style={styles.workoutName}>{workout.name}</Text>
          <Text style={styles.workoutDescription}>{generateBriefDescription()}</Text>
        </View>
      </Pressable>
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
  workoutName: {
    fontSize: 18,
    fontWeight: "700"
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 5,
  },
  modifyButton: {
    backgroundColor: '#e0e0e0', 
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#ffcdd2', 
    marginLeft: 5,
  },
});
