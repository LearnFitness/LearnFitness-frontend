import { StyleSheet, Platform, StatusBar, View, Pressable } from "react-native";
import LinearBackground from "../../components/LinearBackground";
import ExercisesSearch from "../../components/ExercisesSearch";
import { AddWorkoutContext } from "../../context/AddWorkoutContext";

const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

export default function ExercisesScreen() {

  function handleAddExerciseToWorkout(exercise) {
    
    console.log("Adding exercise to workout: ", exercise)
  }

  return (
    <AddWorkoutContext.Provider value={{ addExercise: handleAddExerciseToWorkout }} >
      <LinearBackground containerStyle={styles.container}>
        <ExercisesSearch />
      </LinearBackground>
    </AddWorkoutContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: "4%",
    paddingTop: statusBarHeight
  },
})
