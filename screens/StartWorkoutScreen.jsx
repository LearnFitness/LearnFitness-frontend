import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert, Text, View, TouchableOpacity, StyleSheet, ScrollView, TextInput, Animated } from 'react-native';
import LinearBackground from '../components/LinearBackground';
import Ionicon from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import RestTimer from '../components/RestTimer';
import toast from '../utils/toast';
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export default function StartWorkoutScreen({ route, navigation }) {
  // This will track the scroll position
  const scrollY = useRef(new Animated.Value(0)).current;
  const marginHorizontalAnim = scrollY.interpolate({
    inputRange: [30, 140], // Define the range of scrollY values
    outputRange: [20, 0],  // Corresponding margins from 20 to 0
    extrapolate: 'clamp'  // This will clamp the output at 0 so it doesn't go negative
  });

  const sessionDate = new Date();
  const { workout, exercise } = route.params;
  const [sessionName, setSessionName] = useState(workout ? workout.name : "");
  const [sessionDescription, setSessionDescription] = useState(workout ? workout.description : "");

  const [sessionDuration, setSessionDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(prevDuration => prevDuration + 1);
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const [exercises, setExercises] = useState(() => {
    return workout.exercises.map(ex => ({
      ...ex,
      sets: Array(ex.sets).fill().map(() => ({ reps: 0, lbs: 0 }))
    }));
  });

  useEffect(() => {
    if (exercise) {
      handleAddExercise(exercise);
    }
  }, [exercise, workout]);

  function handleAddExercise(exercise) {
    const exerciseExists = exercises.some((ex) => ex.id === exercise.id);
    if (!exerciseExists) {
      const sets = workout ? exercise.sets : [{ reps: 0, lbs: 0 }];
      setExercises(prevExercises => [...prevExercises, { ...exercise, sets }]);
    } else {
      Alert.alert("Exercise already added to the workout.");
    }
  }

  function handleRemoveExercise(exerciseId) {
    setExercises(prevExercises => prevExercises.filter((ex) => ex.id !== exerciseId));
  }

  function handleAddSet(exerciseId) {
    const updatedExercises = exercises.map(ex => {
      if (ex.id === exerciseId) {
        const updatedSets = [...ex.sets, { reps: 0, lbs: 0 }];
        return { ...ex, sets: updatedSets };
      }
      return ex;
    })
    setExercises(updatedExercises);
  };

  function handleRemoveSet(exerciseId, setIndex) {
    const updatedExercises = exercises.map(ex => {
      if (ex.id === exerciseId) {
        if (ex.sets.length > 1) {
          const updatedSets = ex.sets.filter((_, index) => index !== setIndex)
          return { ...ex, sets: updatedSets };
        }
        else {
          toast("At least 1 set is required.");
        }
      }
      return ex;
    })
    setExercises(updatedExercises);
  };

  function handleUpdateReps(exerciseId, setIndex, reps) {
    const updatedExercises = exercises.map(ex => {
      if (ex.id === exerciseId) {
        const updatedSets = ex.sets.map((set, index) =>
          index === setIndex ? { ...set, reps: reps } : set
        );
        return { ...ex, sets: updatedSets };
      }
      return ex;
    });
    setExercises(updatedExercises);
  };

  function handleUpdateLbs(exerciseId, setIndex, lbs) {
    const updatedExercises = exercises.map(ex => {
      if (ex.id === exerciseId) {
        const updatedSets = ex.sets.map((set, index) =>
          index === setIndex ? { ...set, lbs: lbs } : set
        );
        return { ...ex, sets: updatedSets };
      }
      return ex;
    });
    setExercises(updatedExercises);
  };

  function handleGoBack() {
    Alert.alert(
      "Discard workout session?",
      "Any unsaved changes will be lost.",
      [
        {
          text: "Keep session",
          style: "cancel",
          onPress: () => { }
        },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => navigation.goBack()
        }
      ]
    )
  }

  async function handleSaveSession() {
    if (!sessionName.trim()) {
      Alert.alert("Session name is required.");
      return;
    }
    if (exercises.length === 0) {
      Alert.alert("Please add exercises to your session.");
      return;
    }

    try {
      const newSession = {
        name: sessionName,
        description: sessionDescription,
        exercises: exercises,
        date: sessionDate,
        duration: sessionDuration
      };
      await firestore().collection("users").doc(auth().currentUser.uid).collection("sessions").add(newSession);
      toast("Session saved");

      navigation.goBack();
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  const ExerciseListView = useCallback(
    () => {
      return (
        <View style={{ paddingHorizontal: "5%" }}>
          {exercises.map(exercise => (
            <View key={exercise.id}>
              <Ionicon
                name="close-circle-outline"
                color="#aa3155"
                size={23}
                style={{ position: "absolute", zIndex: 2, right: 15, top: 28 }}
                onPress={() => handleRemoveExercise(exercise.id)}
              />
              <ExerciseSets exercise={exercise} />
            </View>
          ))}

          <TouchableOpacity style={styles.addExerciseButton} onPress={() => navigation.navigate("ExercisesSearchModal")}>
            <FontAwesome name="plus" color="white" size={23} />
            <Text style={styles.addExerciseButtonText}>Add Exercise</Text>
          </TouchableOpacity>
        </View>
      )
    },
    [exercises],
  );

  return (
    <LinearBackground containerStyle={styles.container} safeAreaView={false}>
      <ScrollView
        stickyHeaderIndices={[3]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }  // Set to false because we're animating layout properties
        )}
        scrollEventThrottle={16}  // Defines how often the scroll event fires
      >
        <TextInput
          style={styles.sessionName}
          placeholder="Workout name"
          placeholderTextColor="darkgrey"
          value={sessionName}
          onChangeText={text => setSessionName(text)}
        />
        <TextInput
          style={styles.sessionDescription}
          placeholder="Workout description"
          placeholderTextColor="darkgrey"
          value={sessionDescription}
          onChangeText={text => setSessionDescription(text)}
        />

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#aa3155" }]} onPress={handleGoBack}>
            <Text style={styles.actionButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#0087d6" }]} onPress={handleSaveSession}>
            <Text style={styles.actionButtonText}>Finish</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Animated.View style={[styles.timeContainer, { marginHorizontal: marginHorizontalAnim }]}>
            <RestTimer />
            <View>
              <Text style={styles.sessionDuration}>
                {padToTwoDigits(Math.floor(sessionDuration / 60))}:{padToTwoDigits(sessionDuration % 60)}
              </Text>
            </View>
          </Animated.View>
        </View>

        <ExerciseListView />

      </ScrollView>
    </LinearBackground>
  )

  function ExerciseSets({ exercise }) {
    return (
      <View style={styles.setsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("ExerciseModal", { exerciseId: exercise.id })}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
        </TouchableOpacity>
        <Text style={styles.exerciseTarget}>{exercise.target}</Text>
        <View style={styles.exerciseHeader}>
          <Text style={[{ flex: 1, marginLeft: 15 }, styles.exerciseHeaderText]}>Set</Text>
          <Text style={[{ flex: 2 }, styles.exerciseHeaderText]}>lbs</Text>
          <Text style={[{ flex: 2 }, styles.exerciseHeaderText]}>Reps</Text>
        </View>
        <View>
          {exercise.sets.map((value, index) => {
            return <Set key={index} set={value} setIndex={index} exercise={exercise} />
          })}
        </View>
        <TouchableOpacity style={styles.addSetButton} onPress={() => handleAddSet(exercise.id)}>
          <Text style={styles.addSetButtonText}>+ Add Set</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function Set({ set, setIndex, exercise }) {
    return (
      <View style={styles.exerciseSet}>
        <Ionicon
          name="remove-circle-outline"
          color="#aa3155"
          size={17}
          onPress={() => handleRemoveSet(exercise.id, setIndex)}
        />
        <Text style={{ flex: 1, textAlign: "center", fontSize: 15 }}>{setIndex + 1}</Text>
        <TextInput
          keyboardType="numeric"
          style={[{ flex: 2 }, styles.exerciseInput]}
          value={set.lbs ? set.lbs.toString() : null}
          onEndEditing={e => {
            const lbs = e.nativeEvent.text ? parseInt(e.nativeEvent.text, 10) : 0;
            handleUpdateLbs(exercise.id, setIndex, lbs);
          }}
        />
        <TextInput
          keyboardType="numeric"
          style={[{ flex: 2 }, styles.exerciseInput]}
          value={set.reps ? set.reps.toString() : null}
          onEndEditing={e => {
            const reps = e.nativeEvent.text ? parseInt(e.nativeEvent.text, 10) : 0;
            handleUpdateReps(exercise.id, setIndex, reps);
          }}
        />
      </View>
    )
  }
}

function SessionTimer() {
  const [sessionDuration, setSessionDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(prevDuration => prevDuration + 1);
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <View>
      <Text style={styles.sessionDuration}>
        {padToTwoDigits(Math.floor(sessionDuration / 60))}:{padToTwoDigits(sessionDuration % 60)}
      </Text>
    </View>
  )
}

function padToTwoDigits(number) {
  return number < 10 ? `0${number}` : number;
}


const styles = StyleSheet.create({
  container: {
    paddingTop: "12%"
  },
  sessionName: {
    color: "white",
    textAlign: "center",
    fontSize: 28,
    fontWeight: "600",
    marginTop: 20
  },
  sessionDescription: {
    color: "grey",
    textAlign: "center",
    fontSize: 18,
    marginVertical: 10
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#05406b",
    marginHorizontal: 20,
    borderRadius: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  sessionDuration: {
    color: "white",
    textAlign: "center",
    margin: 10,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 1,

  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  actionButton: {
    width: "40%",
    height: 35,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  },
  actionButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600"
  },
  addExerciseButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 30,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10
  },
  addExerciseButtonText: {
    color: "darkgrey",
    fontSize: 17,
    margin: 5
  },

  // Sets
  setsContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginTop: 15
  },
  exerciseName: {
    color: "blue",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    textTransform: "capitalize",
    marginBottom: 5,
    marginHorizontal: "5%"
  },
  exerciseTarget: {
    color: "grey",
    textAlign: "center",
    textTransform: "capitalize",
    marginBottom: 5
  },
  exerciseHeader: {
    flexDirection: "row",
  },
  exerciseHeaderText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    alignItems: "center"
  },
  exerciseSet: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5
  },
  exerciseInput: {
    textAlign: "center",
    backgroundColor: "rgb(245, 245, 245)",
    padding: 3,
    marginHorizontal: 3,
    borderRadius: 5,
    fontSize: 15
  },
  addSetButton: {
    alignSelf: "center",
    backgroundColor: "lightgrey",
    width: "40%",
    padding: 3,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5
  }
});