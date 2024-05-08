import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  Button,
  Modal,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StatusBar
} from "react-native";
import { useIsFocused } from '@react-navigation/native';
import LinearBackground from "../../components/LinearBackground";
import auth from "@react-native-firebase/auth";
import { Feather } from "@expo/vector-icons";
import AvatarDisplay from "../../components/AvatarDisplay";
import firestore from "@react-native-firebase/firestore";
import { Calendar, CalendarList } from "react-native-calendars";
import { getBackendDataWithRetry } from "../../utils/backendAPI";
import { useEffect, useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import moment from "moment";
import {
  BarChart,
} from "react-native-chart-kit";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';

export default function ChartsScreen({ navigation }) {
  // export default function ProgressScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showHistory, setHistory] = useState(false);
  const [completedWorkoutDates, setCompletedWorkoutDates] = useState({});
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [avgWorkoutDuration, setAvgWorkoutDuration] = useState(0);
  const [caloriesBurnedPerWeek, setCaloriesBurnedPerWeek] = useState(0);
  const [workoutTimePerDay, setWorkoutTimePerDay] = useState([
    0, 0, 0, 0, 0, 0, 0,
  ]);
  const [maxWorkoutTime, setMaxWorkoutTime] = useState(0);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState([]);
  const [maxVolumePerExercise, setMaxVolumePerExercise] = useState({});
  const [exerciseNames, setExerciseNames] = useState({});

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .onSnapshot(() => {
        async function fetchData() {
          setLoading(true);
          try {
            const userData = await getBackendDataWithRetry("/user");
            setUserData(userData);
          } catch (error) {
            Alert.alert("An error occurred", error.message);
          } finally {
            setLoading(false);
          }
        }
        fetchData();
      });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("sessions")
      .onSnapshot((snapshot) => {
        const dates = {};
        let totalWorkouts = 0;
        let totalDuration = 0;
        let workoutTimePerDayCopy = [0, 0, 0, 0, 0, 0, 0];
        const maxVolumeData = {};
        snapshot.forEach((doc) => {
          const session = doc.data();
          const sessionDate = new Date(session.date.seconds * 1000);
          const dayIndex = sessionDate.getDay();
          const year = sessionDate.getFullYear();
          const month = String(sessionDate.getMonth() + 1).padStart(2, "0");
          const day = String(sessionDate.getDate()).padStart(2, "0");
          const pstDateString = `${year}-${month}-${day}`;
          const maxTime = Math.max(...workoutTimePerDay);
          setMaxWorkoutTime(maxTime);
          dates[pstDateString] = { marked: true };
          totalWorkouts++;
          totalDuration += session.duration;
          workoutTimePerDayCopy[dayIndex] += session.duration / 60;
          session.exercises.forEach(exercise => {
            exercise.sets.forEach(set => {
              const volume = set.lbs * set.reps;
              if (volume > 0 && (!maxVolumeData[exercise.id] || volume > maxVolumeData[exercise.id].volume)) {
                maxVolumeData[exercise.id] = { volume, reps: set.reps, lbs: set.lbs };
              }
            });
          });
        });
        setCompletedWorkoutDates(dates);
        setTotalWorkouts(totalWorkouts);
        setMaxVolumePerExercise(maxVolumeData);

        if (totalWorkouts > 0) {
          const firstSessionDate =
            Object.keys(dates).length > 0
              ? new Date(Object.keys(dates)[0])
              : new Date();
          const daysBetween = Math.ceil(
            (new Date() - firstSessionDate) / (1000 * 60 * 60 * 24)
          );
          const weeksBetween = Math.ceil(daysBetween / 7);

          const avgDuration = totalDuration / totalWorkouts;
          setAvgWorkoutDuration(avgDuration / 60);

          const caloriesBurned = (totalWorkouts * 400) / weeksBetween;
          setCaloriesBurnedPerWeek(caloriesBurned);

          setWorkoutTimePerDay(workoutTimePerDayCopy);
        } else {
          setAvgWorkoutDuration(0);
          setCaloriesBurnedPerWeek(0);
        }
      });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('exercises')
      .onSnapshot(snapshot => {
        const names = {};
        snapshot.forEach(doc => {
          const exerciseData = doc.data();
          names[doc.id] = exerciseData.name;
        });
        setExerciseNames(names);
      });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const weeklyData = [];
    const firstSessionDate =
      Object.keys(completedWorkoutDates).length > 0
        ? new Date(Object.keys(completedWorkoutDates)[0])
        : new Date();
    const lastSessionDate = new Date();
    const firstSunday = moment(firstSessionDate).startOf("week").toDate();
    let weekStart = firstSunday;
    while (weekStart <= lastSessionDate) {
      const weekEnd = moment(weekStart).endOf("week").toDate();
      const weekLabel = `${moment(weekStart).format("M/D")} - ${moment(
        weekEnd
      ).format("M/D")}`;
      let weeklyWorkoutCount = 0;
      for (const date in completedWorkoutDates) {
        const currentDate = new Date(date);
        if (currentDate >= weekStart && currentDate <= weekEnd) {
          weeklyWorkoutCount++;
        }
      }
      weeklyData.push({ weekLabel, weeklyWorkoutCount });
      weekStart = moment(weekStart).add(1, "week").toDate();
    }
    setWeeklyWorkouts(weeklyData);
  }, [completedWorkoutDates]);

  const capitalizeFirstLetter = (string) => {
    return string.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  function FocusAwareStatusBar(props) {
    const isFocused = useIsFocused();
    return isFocused ? <StatusBar {...props} /> : null;
  }

  return (
    <LinearBackground containerStyle={{ flex: 1, paddingHorizontal: "3%", alignItems: "center", justifyContent: "center" }}>
      <FocusAwareStatusBar
        translucent
        backgroundColor="transparent"
        barStyle={"dark-content"}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFFFFF" style={styles.loading} />
        ) : (
          <SafeAreaView style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>Workout Intensity Over the Week</Text>
            <BarChart
              data={{
                labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                datasets: [{ data: workoutTimePerDay }],
              }}
              width={Dimensions.get("window").width - 40}
              height={220}
              chartConfig={styles.chartConfig}
              fromZero
              style={styles.chartStyle}
            />

            <Text style={styles.sectionTitle}>Total Workouts Per Week</Text>
            <BarChart
              data={{
                labels: weeklyWorkouts.map(data => data.weekLabel),
                datasets: [{ data: weeklyWorkouts.map(data => data.weeklyWorkoutCount) }],
              }}
              width={Dimensions.get("window").width - 40}
              height={220}
              chartConfig={styles.chartConfig}
              fromZero
              style={styles.chartStyle}
            />

            <View style={styles.statsContainer}>
              <Text style={styles.sectionTitle}><MaterialCommunityIcons name="calendar-week" size={24} color="white" />  Weekly Summary</Text>
              <Text style={styles.statText}>Total Workouts: {totalWorkouts}</Text>
              <Text style={styles.statText}>Average Duration: {avgWorkoutDuration.toFixed(2)} min</Text>
              <Text style={styles.statText}>Calories Burned: {caloriesBurnedPerWeek.toFixed(0)} cal/week</Text>
            </View>

            <Text style={styles.sectionTitle}><FontAwesome6 name="trophy" size={22} color="white" />  Personal Records</Text>
            <ScrollView style={styles.prScroll}>
              {Object.entries(maxVolumePerExercise).map(([id, { reps, lbs }]) => (
                <View key={id} style={styles.prItem}>
                  <Text style={[styles.prText, { textTransform: "capitalize", fontWeight: "500" }]}>{exerciseNames[id] || 'Unknown'}</Text>
                  <Text style={styles.prText}>{lbs} lbs x {reps} reps</Text>
                </View>
              ))}
            </ScrollView>
          </SafeAreaView>
        )}
      </ScrollView>
    </LinearBackground>
  );
}


const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  contentContainer: {
    padding: 10,
  },
  loading: {
    marginTop: 50,
  },
  sectionTitle: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10
  },
  chartStyle: {
    borderRadius: 8,
  },
  chartConfig: {
    backgroundColor: "#1cc910",
    backgroundGradientFrom: "#eff3ff",
    backgroundGradientTo: "#efefef",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 15 },
    propsForLabels: {
      fontFamily: "Arial",
      fontSize: 11,
    },
    barPercentage: 0.6,
  },
  statsContainer: {
    marginVertical: 10
  },
  statTitle: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginBottom: 5,
  },
  statText: {
    fontSize: 16,
    color: "white",
    marginBottom: 5,
  },
  prScroll: {
    marginBottom: 20,
  },
  prItem: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 5,
    padding: 10,
    marginTop: 7,

    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap"
  },
  prText: {
    fontSize: 14,
    color: "white",
  }
});
