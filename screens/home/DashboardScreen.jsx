import { View, Text, ActivityIndicator, Alert, StyleSheet, StatusBar, Pressable, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { getBackendDataWithRetry } from "../../utils/backendAPI";
import LinearBackground from "../../components/LinearBackground";
import AvatarDisplay from "../../components/AvatarDisplay";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const currentDayOfWeek = daysOfWeek[new Date().getDay()];
const motivationalSentences = [
  "Lighten up your day by completing a workout!",
  "Start your day right with a workout!",
  "Push yourself to new limits today!",
  "Make today count with a great workout!",
  // Add more motivational sentences as needed
];

function getRandomSentence() {
  const randomIndex = Math.floor(Math.random() * motivationalSentences.length);
  return motivationalSentences[randomIndex];
}

export default function DashboardScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getBackendDataWithRetry("/user");
        setUserData(userData);
      } catch (error) {
        Alert.alert("An error occured", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <LinearBackground>
      {/* Changes status bar icon color for ALL pages to white
      (use FocusAwareStatusBar as seen in SettingsScreen.jsx for individual screens) */}
      <StatusBar translucent backgroundColor="transparent" barStyle={"light-content"} />
      {loading || !userData ?
        (
          <ActivityIndicator style={{ flex: 1 }} />
        ) : (
          <View>
            <View style={styles.greetingContainer}>
              <View>
                <Text style={styles.greetingText} >Good Morning,</Text>
                <Text style={styles.greetingName} >{userData.name.split(" ")[0]}</Text>
              </View>
              <AvatarDisplay source={{ uri: userData.photoURL }} size={120} editable={false} />
            </View>
            <View style={styles.finishedWorkoutsContainer}>
              <Text style={styles.finishedWorkoutsText}>Finished Workouts</Text>
              <Pressable
                onPress={() => navigation.navigate("Progress")}>
                <Text style={{ textAlign: "center", marginTop: 4, fontSize: 17, color: "#9E9E9E" }}>View All →</Text>
              </Pressable>
            </View>
            <View style={styles.completedWorkoutsContainer}>
              <Text style={styles.completedWorkoutsText}>
                No completed workouts yet.
                {'\n'}
                Start a new workout!
              </Text>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statText}>
                <Text style={styles.statNumber}>32</Text>
                <Text style={styles.subText}>WORKOUTS COMPLETED</Text>
              </View>
              <View style={styles.statText}>
                <Text style={styles.statNumber}>2</Text>
                <Text style={styles.subText}>DAYS SINCE LAST WORKOUT</Text>
              </View>
              <View style={styles.statText}>
                <Text style={styles.statNumber}>10</Text>
                <Text style={styles.subText}>PR ACHIEVED THIS WEEK</Text>
              </View>
            </View>
            <View style={styles.lineContainer}>
              <View style={styles.horizontalLine} />
            </View>
            <Text style={styles.dayText}>It's {currentDayOfWeek}!</Text>
            <Text style={styles.motivationalText}>{getRandomSentence()}</Text>
            <View style={styles.buttonContainer}>
              <Pressable onPress={() => navigation.navigate("Workouts")} style={{ height: 55, width: 250, backgroundColor: "#FFFFFF", borderRadius: 30, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "#0044AA", fontWeight: "600", fontSize: 22, textAlign: "center" }}>View Workouts →</Text>
              </Pressable>
            </View>
          </View>
        )
      }
    </LinearBackground>
  )
}



const styles = StyleSheet.create({
  greetingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    flexWrap: "wrap",
    margin: 20,
    paddingTop: 30
  },
  greetingText: {
    color: "white",
    fontSize: 22,
    fontStyle: "italic",
    paddingRight: 5
  },
  greetingName: {
    color: "white",
    fontSize: 40,
    fontWeight: "900",
    fontStyle: "italic",
  },
  finishedWorkoutsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 35
  },
  finishedWorkoutsText: {
    color: "white",
    fontSize: 20,
    paddingTop: 5
  },
  viewAllButton: {
    backgroundColor: "transparent",
    opacity: 0.7,
  },
  viewAllButtonText: {
    fontWeight: "normal",
    color: "white",
  },
  completedWorkoutsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
    marginHorizontal: 30,
    marginBottom: 20,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 175,
  },
  completedWorkoutsText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  statText: {
    flex: 1,
    alignItems: "center",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10
  },
  statNumber: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
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
    paddingHorizontal: 20,
  },
  lineContainer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 40,
  },
  horizontalLine: {
    width: "40%",
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  dayText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontStyle: "italic",
  },
  motivationalText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontStyle: "italic",
    marginHorizontal: 20,
  },
  buttonContainer: {
    marginTop: 15,
    marginBottom: 15,
    alignItems: "center"
  },
})


