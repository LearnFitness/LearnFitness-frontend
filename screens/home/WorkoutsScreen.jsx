import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Alert, ActivityIndicator, Modal, TouchableOpacity } from "react-native";
import LinearBackground from "../../components/LinearBackground";
import { getBackendData } from "./../../utils/backendAPI";
import { WorkoutModal } from "../../components/WorkoutModal";

export default function WorkoutsScreen({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [recommendedWorkouts, setRecommendedWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isWorkoutModalVisible, setWorkoutModalVisible] = useState(false);

  // Get workouts from Firestore
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .collection("workouts")
      .onSnapshot(() => {
        async function getWorkouts() {
          setLoading(true);
          try {
            // Get user's workouts
            const workouts = await getBackendData("user/workouts");
            // Get user's recommended workouts
            const userDocRef = await firestore().collection("users").doc(auth().currentUser.uid).get();
            
            setRecommendedWorkouts([]);
            userDocRef.data().recommendedWorkouts.forEach(async (workoutId) => {
              const workoutSnapshot = await firestore().collection("premade_workouts").doc(workoutId).get();
              setRecommendedWorkouts(prev => [ ...prev, workoutSnapshot.data()]);
            })
            setWorkouts(workouts);
          } catch (error) {
            Alert.alert(error.message);
          } finally {
            setLoading(false);
          }
        }
        getWorkouts();
      });

    // Stop listening for updates when no longer required
    return () => unsubscribe();
  }, []);

  function handleCloseModal() {
    setWorkoutModalVisible(false);
  }

  const handleAddWorkout = () => {
    navigation.navigate("AddWorkoutScreen", { headerTitle: "Create workout", action: "create" });
  };


  const WorkoutItem = ({ workout, isYourWorkout }) => {
    const handleQuickView = () => {
      setSelectedWorkout(workout);
      setWorkoutModalVisible(true);
    };

    const generateBriefDescription = () => {
      if (workout.exercises.length === 1) {
        return `• ${workout.exercises[0].sets} x ${workout.exercises[0].name}`;
      } else {
        const firstTwoExercises = workout.exercises.slice(0, 2).map(exercise => `• ${exercise.sets} x ${exercise.name}`);
        return `${firstTwoExercises.join("\n")} \n...`;
      }
    };

    return (
      <TouchableOpacity activeOpacity={0.7} style={styles.workoutItemContainer} onPress={handleQuickView}>
        <Image source={require("./../../assets/workout_plans_images/leg1.jpg")} style={styles.workoutImage} />
        <View style={styles.workoutDetailsContainer}>
          <Text style={styles.workoutName}>{workout.name}</Text>
          <Text style={styles.workoutDescription}>{generateBriefDescription()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearBackground containerStyle={styles.container}>
      {loading ? <ActivityIndicator style={{ flex: 1 }} />
        : (
          <>
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
              <Text style={styles.title}>Your Workouts</Text>
              <View style={styles.workoutsContainer}>
                {workouts.length === 0 ?
                  <Text style={{ color: "darkgrey", fontSize: 17 }}>You have no workouts yet</Text>
                  :
                  workouts.map((workout, index) => (
                    <WorkoutItem
                      key={index}
                      workout={workout}
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
                    />
                  )
                  )}
              </View>

            </ScrollView>
            <TouchableOpacity activeOpacity={0.4} style={styles.addButton} onPress={handleAddWorkout}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>

            <WorkoutModal
              workout={selectedWorkout}
              navigation={navigation}
              isWorkoutModalVisible={isWorkoutModalVisible}
              handleCloseModal={handleCloseModal}
            />
          </>
        )}
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
    marginTop: 25,
    marginBottom: 10
  },
  workoutsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  workoutItemContainer: {
    width: "48%",
    borderRadius: 10,
    backgroundColor: "white",
    marginBottom: 14
  },
  workoutImage: {
    width: '100%',
    height: 150,
    alignSelf: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  workoutDetailsContainer: {
    padding: 10
  },
  workoutName: {
    fontSize: 18,
    fontWeight: "700"
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
    backgroundColor: "teal",


    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2.22,

    elevation: 3,
  },
  addButtonText: {
    color: "rgba(0, 0, 0, 0.6)",
    fontSize: 30,
  },
});
