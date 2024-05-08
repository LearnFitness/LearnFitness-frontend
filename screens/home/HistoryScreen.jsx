import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
  SectionList,
  Alert,
  StatusBar
} from "react-native";
import { useIsFocused } from '@react-navigation/native';
import { Calendar } from "react-native-calendars";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import LinearBackground from "../../components/LinearBackground";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const HistoryScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [showCalendar, setShowCalendar] = useState(true);
  const [markedDates, setMarkedDates] = useState({});
  const sectionListRef = useRef(null);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8); // Start smaller to create an unfolding effect
  const calendarHeight = useSharedValue(0); // Manage calendar height for animation

  const [selectedDate, setSelectedDate] = useState("");

  const onDayPress = (day) => {
    const selectedDateString = day.dateString;
    const hasWorkouts = markedDates[selectedDateString] && markedDates[selectedDateString].marked;

    if (hasWorkouts) {
      scrollToDate(selectedDateString);
      setSelectedDate(selectedDateString);
    } else {
      // Display alert if no workouts are found for the selected date
      Alert.alert(
        "No workouts!",
        "There are no completed workouts for this date.",
        [{ onPress: () => console.log("OK") }],
        { cancelable: true }
      );
    }
  };

  useEffect(() => {
    if (markedDates[selectedDate]) {
      let newMarkedDates = {}

      for (const key of Object.keys(markedDates)) {
        if (key === selectedDate) {
          newMarkedDates[key] = {
            selected: true,
            disableTouchEvent: true,
            selectedColor: "blue",
            marked: true,
            dotColor: "white",
          };
        } else {
          newMarkedDates[key] = { dotColor: "blue", marked: true };
        }
      }
      setMarkedDates(newMarkedDates);
    }
  }, [selectedDate]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("sessions")
      .orderBy("date", "asc")
      .onSnapshot(snapshot => {
        const groupedByMonth = {};
        let newMarkedDates = {};  // Initialize newMarkedDates here to ensure it's reset on each snapshot.

        snapshot.forEach(doc => {
          const session = doc.data();
          const sessionDate = new Date((session.date.seconds * 1000) + (session.date.nanoseconds / 1000000));
          // const formattedDate = sessionDate.toISOString().split("T")[0]
          const dateArray = sessionDate.toLocaleString().split(',')[0].split("/");
          const formattedDate =
            dateArray[2] +
            "-" +
            (dateArray[0].length === 1 ? "0" + dateArray[0] : dateArray[0]) +
            "-" +
            (dateArray[1].length === 1 ? "0" + dateArray[1] : dateArray[1]);

          // Group by month for sections
          const yearMonth = formattedDate.substring(0, 7);
          if (!groupedByMonth[yearMonth]) {
            groupedByMonth[yearMonth] = [];
          }
          groupedByMonth[yearMonth].push({ ...session, id: doc.id, formattedDate });

          // Prepare marked dates
          if (!newMarkedDates[formattedDate]) {
            newMarkedDates[formattedDate] = { marked: true, dotColor: 'blue' };
          }
        });

        setMarkedDates(newMarkedDates);  // Update the state only once after processing all documents

        const sectionsArray = Object.keys(groupedByMonth).map(key => ({
          title: formatDate(key),
          data: groupedByMonth[key]
        }));
        setSessions(sectionsArray);
        setLoading(false);
      });
    return () => unsubscribe();
  }, []);


  const formatDate = (yearMonth) => {
    const [year, month] = yearMonth.split("-");
    return `${new Date(year, month - 1).toLocaleString("default", {
      month: "long",
    })} ${year}`;
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
    opacity.value = withTiming(showCalendar ? 1 : 0, { duration: 500 });
    scale.value = withSpring(showCalendar ? 1 : 0.8, {
      damping: 10,
      stiffness: 100,
    });
    calendarHeight.value = withTiming(showCalendar ? 330 : 0, {
      duration: 500,
    });
  };

  const calendarStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
      height: calendarHeight.value,
    };
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.6}
      key={item.id}
      style={styles.completedWorkout}
      onPress={() => {
        handleViewSession(item)
      }}
    >
      <Image
        source={{ uri: item.imgUrl }}
        style={styles.workoutImage}
      />
      <View style={styles.completedWorkoutDetails}>
        <Text style={styles.workoutName}>{item.name}</Text>
        <Text style={styles.workoutDate}>
          {new Date(item.date.seconds * 1000).toDateString()} at{" "}
          {new Date(item.date.seconds * 1000).toLocaleTimeString()}
        </Text>
        <Text style={styles.workoutExercisesCount}>
          {`${item.exercises.length} ${item.exercises.length > 1 ? "exercises" : "exercise"
            } - ${Math.ceil(item.duration / 60)} minutes`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  function handleViewSession(session) {
    navigation.navigate("SessionModal", {
      session: { id: session.id, data: session }
    });
  }

  const scrollToDate = (date) => {
    const yearMonth = date.substring(0, 7); // Get 'YYYY-MM' from 'YYYY-MM-DD'
    const sectionIndex = sessions.findIndex(
      (section) => section.title === formatDate(yearMonth)
    );

    if (sectionIndex === -1) {
      console.warn("No section found for the month");
      return; // Early return if no section is found
    }

    // Attempt to find the item index for the exact date
    const itemIndex = sessions[sectionIndex].data.findIndex(
      (item) => item.formattedDate === date
    );

    if (itemIndex === -1) {
      console.warn("No item found for the date", date);
      // Optionally, you might choose to scroll to the start of the month if no exact date is found
      // This is up to your app's requirements
      sectionListRef.current.scrollToLocation({
        sectionIndex: sectionIndex,
        itemIndex: 0,
        viewOffset: 50,
      });
    } else {
      sectionListRef.current.scrollToLocation({
        sectionIndex: sectionIndex,
        itemIndex: itemIndex,
        viewOffset: 25, // Adjust this value as needed to fine-tune the position
      });
    }
  };

  function FocusAwareStatusBar(props) {
    const isFocused = useIsFocused();
    return isFocused ? <StatusBar {...props} /> : null;
  }

  return (
    <LinearBackground>
      <FocusAwareStatusBar
        translucent
        backgroundColor="transparent"
        barStyle={"dark-content"}
      />
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} />
      ) : (
        <SafeAreaView style={styles.container}>
          <Animated.View style={[styles.calendarContainer, calendarStyle]}>
            <Calendar
              onDayPress={onDayPress}
              // onDayPress={(day) => scrollToDate(day.dateString)}

              markingType={"simple"}
              markedDates={markedDates}

            />
          </Animated.View>
          <TouchableOpacity style={styles.fab} onPress={toggleCalendar}>
            <Icon
              name={showCalendar ? "calendar-plus" : "calendar-remove"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>

          {sessions.length === 0 ?
            <View>
              <Text style={{ color: "grey", fontSize: 18, textAlign: "center", margin: 20 }}>No completed workouts yet</Text>
            </View>
            :
            <SectionList
              ref={sectionListRef}
              sections={sessions}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
            />
          }
        </SafeAreaView>
      )}
    </LinearBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarContainer: {
    overflow: "hidden",
  },
  completedWorkout: {
    flexDirection: "row",
    backgroundColor: "white",
    marginVertical: 5,
    marginHorizontal: 15,
    borderRadius: 5,
  },
  completedWorkoutDetails: {
    padding: 10,
    maxWidth: "75%",
  },
  workoutImage: {
    height: "100%",
    width: 80,
    resizeMode: "cover",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: "500",
    color: "navy",
  },
  workoutDate: {
    color: "grey",
    fontSize: 15,
    marginVertical: 2,
  },
  workoutExercisesCount: {
    fontSize: 16,
  },
  sectionHeader: {
    backgroundColor: "#f7f7f7", // A light grey background
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333", // Darker text color for better readability
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "teal",
    padding: 19,
    borderRadius: 30,
    elevation: 4,
    zIndex: 10,
  },
});

export default HistoryScreen;
