import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useScrollViewOffset,
  useAnimatedRef
} from 'react-native-reanimated';
import { Divider, SpeedDial } from '@rneui/themed';
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import toast from '../utils/toast';

// The max scroll threshold to track and use for animation
const SCROLL_THRESHOLD = 150;

export default function SessionModal({ route, navigation }) {
  const { session } = route.params;
  const sessionDate = new Date(session.data.date.seconds * 1000);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Track ScrollView scroll offset
  const animatedRef = useAnimatedRef();
  const scrollOffset = useScrollViewOffset(animatedRef);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const imageSize = interpolate(
      scrollOffset.value,
      [0, SCROLL_THRESHOLD],
      [200, 50],
      Extrapolation.CLAMP
    );

    const imageMarginTop = interpolate(
      scrollOffset.value,
      [0, SCROLL_THRESHOLD],
      [60, 15],
      Extrapolation.CLAMP
    );

    return {
      width: imageSize,
      height: imageSize,
      marginTop: imageMarginTop
    }
  })

  function handleEditSession() {
    navigation.goBack();
    navigation.navigate("StartWorkoutScreen", { workout: { ...session.data, id: session.id }, action: "edit", headerTitle: "Edit completed workout" })
  }

  function handleDeleteSession() {
    Alert.alert(
      "Delete session?",
      "This cannot be undone",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteSession
        }
      ],
      { cancelable: true }
    )

    async function deleteSession() {
      setLoading(true);
      try {
        await firestore()
          .collection("users")
          .doc(auth().currentUser.uid)
          .collection("sessions")
          .doc(session.id)
          .delete();
        toast("Workout deleted");
      } catch (error) {
        Alert.alert(error.message);
      } finally {
        setLoading(false);
        navigation.goBack();
      }
    }
  }

  return (
    <View style={styles.container} >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        <Text style={styles.titleText}>Completed workout</Text>
        {loading ? null : <AntDesign name="close" color="grey" size={22} style={{ position: "absolute", right: 20 }} onPress={() => navigation.goBack()} />}
      </View>
      <Divider />
      {loading ?
        <ActivityIndicator style={{ flex: 1 }} />
        :
        <>
          <Animated.Image
            source={require("./../assets/workout_plans_images/leg1.jpg")}
            style={[styles.sessionImage, imageAnimatedStyle]}
            resizeMode="cover"
          />
          <View style={styles.sessionDetails}>
            <Text style={styles.sessionName}>{session.data.name}</Text>
            <Text style={styles.sessionDate}>{sessionDate.toDateString()} at {sessionDate.toLocaleTimeString()}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.sessionDuration}>
                <FontAwesome6 name="dumbbell" color="grey" size={15} />
                <Text style={styles.sessionDurationText}>{session.data.exercises.length} exercises</Text>
              </View>
              <View style={styles.sessionDuration}>
                <AntDesign name="clockcircle" color="grey" size={15} />
                <Text style={styles.sessionDurationText}>{Math.ceil(session.data.duration / 60)}m</Text>
              </View>
            </View>
          </View>
          <Animated.ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={styles.scrollContainer}
            ref={animatedRef}
            scrollEventThrottle={15}
          >
            <View style={styles.sessionExercises}>
              {session.data.exercises.map(exercise => {
                return (
                  <View key={exercise.id} style={styles.exerciseContainer}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    {exercise.sets.map((value, index) => {
                      return (
                        <Text style={styles.exerciseSet} key={index}>{index + 1}. {value.lbs} lbs x {value.reps}</Text>
                      )
                    })}
                  </View>
                )
              })}
            </View>
          </Animated.ScrollView>
          <SpeedDial
            isOpen={open}
            icon={{ name: 'edit', color: '#fff' }}
            openIcon={{ name: 'close', color: '#fff' }}
            onOpen={() => setOpen(!open)}
            onClose={() => setOpen(!open)}
            buttonStyle={{ backgroundColor: "teal" }}
          >
            <SpeedDial.Action
              icon={{ name: 'edit', color: '#fff' }}
              title="Edit"
              onPress={() => handleEditSession()}
              buttonStyle={{ backgroundColor: "teal" }}
            />
            <SpeedDial.Action
              icon={{ name: 'delete', color: '#fff' }}
              title="Delete"
              onPress={() => handleDeleteSession()}
              buttonStyle={{ backgroundColor: "teal" }}
            />
          </SpeedDial>
        </>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: "8%",
    paddingTop: "3%",
    paddingBottom: "20%"
  },
  sessionExercises: {
  },
  sessionImage: {
    marginTop: 40,
    borderRadius: 10,
    alignSelf: "center"
  },
  sessionDetails: {
    alignItems: 'center',
    margin: 10
  },
  titleText: {
    fontSize: 18,
    fontWeight: "500",
    margin: 20,
    textAlign: "center"
  },
  sessionDuration: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    marginHorizontal: 8
  },
  sessionDurationText: {
    marginHorizontal: 5,
    color: "grey",
    fontSize: 16
  },
  sessionName: {
    color: "teal",
    fontSize: 22,
    fontWeight: "700",
    margin: 4
  },
  sessionDate: {
    fontSize: 16,
    color: "grey"
  },
  exerciseContainer: {
    margin: 5,
    backgroundColor: "rgb(254,254,254)",
    borderRadius: 10,
    padding: 15,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,

    elevation: 3,
  },
  exerciseName: {
    textAlign: "center",
    textTransform: "capitalize",
    fontWeight: "500",
    fontSize: 17
  },
  exerciseSet: {
    color: "grey",
    fontSize: 15,
    marginVertical: 2
  }
});
