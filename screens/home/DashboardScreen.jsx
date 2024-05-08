import { View, Text, ActivityIndicator, Alert, StyleSheet, StatusBar, Pressable, ScrollView, Platform, TouchableOpacity, Image } from "react-native";
import { useEffect, useState } from "react";
import LinearBackground from "../../components/LinearBackground";
import AvatarDisplay from "../../components/AvatarDisplay";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome6"
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import News from "../../components/News";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const currentDayOfWeek = DAYS_OF_WEEK[new Date().getDay()];
const MOTIVATIONAL_QUOTES = [
  "Lighten up your day by completing a workout!",
  "Start your day right with a workout!",
  "Push yourself to new limits today!",
  "Make today count with a great workout!",
  // Add more motivational sentences as needed
];
const COMPLIMENT_QUOTES = [
  "You completed a workout today.",
]

function getQuote(quoteData) {
  const randomIndex = Math.floor(Math.random() * quoteData.length);
  return quoteData[randomIndex];
}

function getDateDiff(dateAsSeconds) {
  return Math.floor((Date.now() / 1000 - dateAsSeconds) / (24 * 60 * 60));
}

export default function DashboardScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);

  // Getting real time user data
  useEffect(() => {
    // Listen for any changes to user document
    const unsubscribe = firestore().collection("users").doc(auth().currentUser.uid).onSnapshot(
      (userSnapshot) => {
        setUserData(userSnapshot.data());
        setLoading(false);
      },
      (error) => Alert.alert(error.message));
    return () => unsubscribe();
  }, []);

  // Getting real time user sessions
  useEffect(() => {
    // Listen for any changes to sessions document
    const unsubscribe = firestore().collection("users").doc(auth().currentUser.uid).collection("sessions").orderBy("date", "desc").onSnapshot(
      (sessionsSnapshot) => {
        setSessions(sessionsSnapshot.docs);
        setLoading(false);
      },
      (error) => Alert.alert(error.message));
    return () => unsubscribe();
  }, []);

  function handleViewSession(session) {
    const sessionData = session.data();
    navigation.navigate("SessionModal", {
      session: {
        id: session.id,
        data: { ...sessionData }
      }
    });
  }

  if (loading || !userData) {
    return (
      <LinearBackground>
        <ActivityIndicator style={{ flex: 1 }} />
      </LinearBackground>
    )
  }

  return (
    <>
      {/* Changes status bar icon color for ALL pages to white
      (use FocusAwareStatusBar as seen in SettingsScreen.jsx for individual screens) */}
      {Platform.OS === "android" ? (
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle={"light-content"}
        />
      ) : null}

      <LinearBackground>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.greetingContainer}>
              <UserGreeting />
              <UserAvatar />
            </View>
            <CompletedWorkouts />
            <WorkoutStats />
            <View style={styles.lineContainer}>
              <View style={styles.horizontalLine} />
            </View>
            <BottomQuotes />
          </View>


          <News />
        </ScrollView>
      </LinearBackground>
    </>
  );

  function UserGreeting() {
    const hour = new Date().getHours();
    //let iconName = "moon";
    //let greeting = "Good night,";

    if (hour < 12) {
      iconName = "sunrise";
      greeting = "Good morning,,"
    } else if (hour >= 12 & hour < 18) {
      iconName = "sun",
        greeting = "Good afternoon,"
    } else {
      iconName = "sunset",
        greeting = "Good evening,"
    }
    return (
      <View>
        <Feather name={iconName} size={20} color="darkgrey" />
        <Text style={styles.greetingText}>{greeting}</Text>
        <Text style={styles.greetingName}>
          {userData.name.split(" ")[0]}
        </Text>
      </View>
    )
  }

  function UserAvatar() {
    return (
      <Pressable onPress={() => navigation.navigate("Settings")}>
        <AvatarDisplay
          source={userData.photoURL ? { uri: userData.photoURL } : null}
          size={110}
          editable={false}
        />
      </Pressable>
    )
  }

  function CompletedWorkouts() {
    return (
      <>
        <View style={styles.completedWorkoutsContainer}>
          <Text style={styles.completedWorkoutsText}>Completed Workouts</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Progress")}>
            <Text style={styles.viewAllButtonText}>View All →</Text>
          </TouchableOpacity>
        </View>
        {sessions.length > 0 ?
          <>
            {sessions.slice(0, sessions.length === 1 ? 1 : 2).map((session, index) => { // Map a maximum of 2 sessions only
              sessionData = session.data();
              const sessionDurationMinutes = Math.ceil(sessionData.duration / 60);
              const exercisesCount = sessionData.exercises.length;
              const sessionDate = new Date(sessionData.date.seconds * 1000);
              return (
                <TouchableOpacity activeOpacity={0.6} key={index} style={styles.completedWorkout} onPress={() => handleViewSession(session)}>
                  <Image source={{ uri: sessionData.imgUrl }} style={styles.workoutImage} />
                  <View style={styles.completedWorkoutDetails}>
                    <Text style={styles.workoutName}>{sessionData.name}</Text>
                    <Text style={styles.workoutDate}>{sessionDate.toDateString()} at {sessionDate.toLocaleTimeString()}</Text>
                    <Text style={styles.workoutExercisesCount}>
                      {`${exercisesCount} ${exercisesCount > 1 ? "exercises" : "exercise"} - ${sessionDurationMinutes} ${sessionDurationMinutes > 1 ? "minutes" : "minute"}`}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </>
          :
          <View style={styles.completedWorkoutsFallback}>
            <Text style={styles.completedWorkoutsFallbackText}>
              {`No completed workouts yet.\nStart a new workout!`}
            </Text>
          </View>
        }
      </>
    )
  }

  function WorkoutStats() {
    const today = new Date().toDateString();
    const todaySessions = sessions.filter(session => new Date(session.data().date.seconds * 1000).toDateString() === today);
    const totalDurationToday = todaySessions.reduce((total, session) => total + session.data().duration, 0);
    const totalDurationTodayMinutes = Math.ceil(totalDurationToday / 60);
    return (
      <View style={styles.statsContainer}>
        <View style={styles.statText}>
          <Text style={styles.statNumber}>{sessions.length}</Text>
          <Text style={styles.subText}>WORKOUTS COMPLETED</Text>
        </View>
        <View style={styles.statText}>
          <Text style={styles.statNumber}>{sessions.length === 0 ? 0 : getDateDiff(sessions[0].data().date.seconds)}</Text>
          <Text style={styles.subText}>{`DAYS SINCE\nLAST WORKOUT`}</Text>
        </View>
        <View style={styles.statText}>
          <Text style={styles.statNumber}>{totalDurationTodayMinutes}</Text>
          <Text style={styles.subText}>MINUTES SPENT WORKING OUT TODAY</Text>
        </View>
      </View>
    )
  }

  function BottomQuotes() {
    return (
      // If user has at least 1 workout and it was today
      sessions.length > 0 && getDateDiff(sessions[0].data().date.seconds) === 0 ?
        <>
          <Text style={styles.bottomTextTitle}>Great job!</Text>
          <Text style={styles.bottomTextSubTitle}>{getQuote(COMPLIMENT_QUOTES)}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("Progress")} activeOpacity={0.6} style={styles.viewWorkoutsButton}>
              <Text style={styles.viewWorkoutsButtonText}>View Progress</Text>
              <FontAwesome name="arrow-right" size={23} color="#0044AA" />
            </TouchableOpacity>
          </View>
        </>
        : //else
        <>
          <Text style={styles.bottomTextTitle}>It's {currentDayOfWeek}!</Text>
          <Text style={styles.bottomTextSubTitle}>{getQuote(MOTIVATIONAL_QUOTES)}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("Workouts")} activeOpacity={0.6} style={styles.viewWorkoutsButton}>
              <Text style={styles.viewWorkoutsButtonText}>View Workouts</Text>
              <FontAwesome name="arrow-right" size={23} color="#0044AA" />
            </TouchableOpacity>
          </View>
        </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: "7%",
    marginTop: "5%"
  },
  greetingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
    flexWrap: "wrap",
    margin: 20,
  },
  greetingText: {
    color: "darkgrey",
    fontSize: 20,
    fontStyle: "italic",
    paddingRight: 5,
    fontWeight: "300"
  },
  greetingName: {
    color: "white",
    fontSize: 30,
    fontWeight: "900",
  },
  completedWorkoutsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  completedWorkoutsText: {
    color: "white",
    fontSize: 20,
    paddingTop: 5,
    fontWeight: "500"
  },
  viewAllButtonText: {
    textAlign: "center",
    marginTop: 4,
    fontSize: 17,
    color: "#9E9E9E",
  },
  completedWorkout: {
    flexDirection: "row",
    backgroundColor: "white",
    marginTop: 10,
    borderRadius: 5
  },
  completedWorkoutDetails: {
    padding: 10,
    maxWidth: "75%"
  },
  workoutImage: {
    height: "100%",
    width: 80,
    resizeMode: "cover",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5
  },
  workoutName: {
    fontSize: 18,
    fontWeight: "500",
    color: "navy",
  },
  workoutDate: {
    color: "grey",
    fontSize: 15,
    marginVertical: 2
  },
  workoutExercisesCount: {
    fontSize: 16
  },
  completedWorkoutsFallback: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 175,
  },
  completedWorkoutsFallbackText: {
    color: "darkgrey",
    fontSize: 18,
    textAlign: "center",
  },
  statText: {
    flex: 1,
    alignItems: "center",
    textAlign: "center",
    fontWeight: "bold",
  },
  statNumber: {
    color: "white",
    fontSize: 30,
    fontWeight: "700",
  },
  subText: {
    color: "white",
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center"
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25
  },
  lineContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  horizontalLine: {
    width: "40%",
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  bottomTextTitle: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: "500"
  },
  bottomTextSubTitle: {
    color: "darkgrey",
    fontSize: 16,
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 5,
    marginBottom: 10
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 15,
    alignItems: "center"
  },
  viewWorkoutsButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  viewWorkoutsButtonText: {
    color: "#0044AA",
    fontWeight: "700",
    fontSize: 20,
    textAlign: "center",
    marginRight: 8
  }
})


