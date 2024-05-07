import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { getColors } from 'react-native-image-colors';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  useAnimatedProps,
  useScrollViewOffset,
  useAnimatedRef
} from 'react-native-reanimated';
import { Divider, SpeedDial } from '@rneui/base';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);


export default function SessionModal({ route, navigation }) {
  const { session } = route.params;
  const sessionDate = new Date(session.data.date.seconds * 1000);
  const [colors, setColors] = useState(null);
  const [open, setOpen] = useState(false);

  const animatedRef = useAnimatedRef();
  const scrollOffset = useScrollViewOffset(animatedRef);

  const animatedStyle = useAnimatedStyle(() => {
    const size = interpolate(
      scrollOffset.value,
      [0, 150],
      [200, 50],
      Extrapolation.CLAMP
    );

    const marginTop = interpolate(
      scrollOffset.value,
      [0, 150], // Input range: from 0 to the difference between max and min sizes
      [60, 15], // Output range: from max size to min size
      Extrapolation.CLAMP // Clamps the output to the min and max sizes
    );
    console.log(scrollOffset.value);

    return {
      width: size,
      height: size,
      marginTop: marginTop,
    };
  });

  const animatedProp = useAnimatedProps(() => {
    const location = interpolate(
      scrollOffset.value,
      [0, 150],
      [0.4, 0.1],
      Extrapolation.CLAMP
    );

    return {
      locations: [0, location],
    };
  });

  // const scrollHandler = useAnimatedScrollHandler({
  //   onScroll: (event) => {
  //     scrollY.value = event.contentOffset.y;
  //   },
  // });

  // const animatedStyle = useAnimatedStyle(() => {
  //   const MAX_IMAGE_SIZE = 220;  // Maximum height of the image
  //   const MIN_IMAGE_SIZE = 60;  // Minimum height of the image

  //   const imageSize = interpolate(
  //     scrollY.value,
  //     [0, MAX_IMAGE_SIZE - MIN_IMAGE_SIZE],  // Input range: from 0 to the difference between max and min sizes
  //     [MAX_IMAGE_SIZE, MIN_IMAGE_SIZE],  // Output range: from max size to min size
  //     Extrapolation.CLAMP  // Clamps the output to the min and max sizes
  //   );

  //   const imageMarginTop = interpolate(
  //     scrollY.value,
  //     [0, 100],  // Input range: from 0 to the difference between max and min sizes
  //     [60, 10],  // Output range: from max size to min size
  //     Extrapolation.CLAMP  // Clamps the output to the min and max sizes
  //   );

  //   return {
  //     width: imageSize,  // Use the interpolated size for both width and height
  //     height: imageSize,
  //     alignSelf: 'center',
  //     marginTop: imageMarginTop
  //   };
  // });

  // const animatedGradientProps = useAnimatedProps(() => {
  //   // Adjust gradient based on scroll position
  //   const endLocation = interpolate(
  //     scrollY.value,
  //     [0, 200], // Assuming 200 is where you want the full effect
  //     [0.4, 0.2], // End location adjusts from 0.4 to 0.1 as you scroll
  //     Extrapolation.CLAMP
  //   );

  //   return {
  //     locations: [0, endLocation],
  //   };
  // });

  useEffect(() => {
    const img = require("./../assets/logo.png");
    // const img = require("./../assets/workout_plans_images/leg1.jpg");

    getColors(img, {
      fallback: "#228B22",
      cache: true,
      key: img,
    }).then((colors) => {
      setColors(colors);
    });
  }, []);

  return (
    <>
      <View style={[{ flex: 1 }]}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={styles.titleText}>Completed workout</Text>
          <AntDesign
            name="close"
            color="grey"
            size={22}
            style={{ position: "absolute", right: 20 }}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>

        <Divider />

        <Animated.Image
          source={require("./../assets/workout_plans_images/leg1.jpg")}
          style={[styles.sessionImage, animatedStyle]}
          resizeMode="cover"
        />

        <View style={styles.sessionDetails}>
          <Text style={styles.sessionName}>{session.data.name}</Text>
          <Text style={styles.sessionDate}>
            {sessionDate.toDateString()} at {sessionDate.toLocaleTimeString()}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.sessionDuration}>
              <FontAwesome6 name="dumbbell" color="grey" size={15} />
              <Text style={styles.sessionDurationText}>
                {session.data.exercises.length} exercises
              </Text>
            </View>
            <View style={styles.sessionDuration}>
              <AntDesign name="clockcircle" color="grey" size={15} />
              <Text style={styles.sessionDurationText}>
                {Math.ceil(session.data.duration / 60)}m
              </Text>
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
            {session.data.exercises.map((exercise) => {
              return (
                <View key={exercise.id} style={styles.exerciseContainer}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  {exercise.sets.map((value, index) => {
                    return (
                      <Text style={styles.exerciseSet} key={index}>
                        {index + 1}. {value.lbs} lbs x {value.reps}
                      </Text>
                    );
                  })}
                </View>
              );
            })}
          </View>

          {/* <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text>Close</Text>
          </TouchableOpacity> */}
        </Animated.ScrollView>
        <SpeedDial
          isOpen={open}
          icon={{ name: "edit", color: "#fff" }}
          openIcon={{ name: "close", color: "#fff" }}
          onOpen={() => setOpen(!open)}
          onClose={() => setOpen(!open)}
          buttonStyle={{ backgroundColor: "teal" }}
        >
          <SpeedDial.Action
            icon={{ name: "edit", color: "#fff" }}
            title="Edit"
            onPress={() => console.log("Add Something")}
            buttonStyle={{ backgroundColor: "teal" }}
          />
          <SpeedDial.Action
            icon={{ name: "delete", color: "#fff" }}
            title="Delete"
            onPress={() => {
              const unsubscribe = firestore()
                .collection("users")
                .doc(auth().currentUser.uid)
                .collection("sessions")
                .doc(session.id)
                .delete()

              navigation.goBack();
            }}
            buttonStyle={{ backgroundColor: "teal" }}
          />

        </SpeedDial>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
    margin: 8,
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
