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
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
  ChartTitle,
} from "react-native-chart-kit";
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
  
  const toggleHistory = () => {
    setHistory(!showHistory);
  };
  
  const capitalizeFirstLetter = (string) => {
    return string.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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
      <ScrollView>
        {loading ? (
          <ActivityIndicator style={{ flex: 1 }} />
        ) : (
          <SafeAreaView>
            <View>
              {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 20, marginTop: 40 }}>
              <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginLeft: 10 }}>My Progress</Text>
                <Pressable onPress={() => navigation.navigate('Settings')}>
                  <AvatarDisplay source={userData && userData.photoURL ? { uri: userData.photoURL } : null} size={60} editable={false} clickable={false} />
                </Pressable>
              </View> */}

              <ScrollView horizontal>
                <View style={styles.chartContainer}>
                  <Text style={styles.chartTitle}>
                    Total Workout Duration Per Day
                  </Text>
                  <BarChart
                    data={{
                      labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                      datasets: [{ data: workoutTimePerDay }],
                    }}
                    width={350}
                    height={220}
                    yAxisSuffix={maxWorkoutTime <= 1 ? " min" : " min"}
                    chartConfig={{
                      backgroundColor: "#1cc910",
                      backgroundGradientFrom: "#eff3ff",
                      backgroundGradientTo: "#efefef",
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      style: { borderRadius: 15 },
                      propsForLabels: {
                        fontFamily: "Arial",
                        fontSize: 12,
                      },
                      barPercentage: 0.6,
                    }}
                    fromZero
                    bezier
                    style={{
                      marginVertical: 8,
                      borderRadius: 16,
                    }}
                  />
                </View>
                <View style={styles.chartContainer}>
                  <Text style={styles.chartTitle}>Total Workouts Per Week</Text>
                  <BarChart
                    data={{
                      labels: weeklyWorkouts.map((data) => data.weekLabel),
                      datasets: [
                        {
                          data: weeklyWorkouts.map(
                            (data) => data.weeklyWorkoutCount
                          ),
                        },
                      ],
                    }}
                    width={Dimensions.get("window").width - 40}
                    height={220}
                    chartConfig={{
                      backgroundColor: "#1cc910",
                      backgroundGradientFrom: "#eff3ff",
                      backgroundGradientTo: "#efefef",
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      style: { borderRadius: 15 },
                      propsForLabels: {
                        fontFamily: "Arial",
                        fontSize: 12,
                      },
                      barPercentage: 0.6,
                    }}
                    fromZero
                    bezier
                    style={{
                      marginVertical: 8,
                      borderRadius: 16,
                    }}
                  />
                </View>
              </ScrollView>
              <View style={{ alignItems: "center" }}>
                <Text
                  style={[
                    styles.chartTitle,
                    { marginBottom: 10, marginTop: 10 },
                  ]}
                >
                  Progress Statistics{" "}
                </Text>
              </View>
              <View style={{ alignItems: "center", marginTop: 20 }}>
                <Text style={styles.statText}>
                  Total Workouts Completed: {totalWorkouts}
                </Text>
                <Text style={styles.statText}>
                  Average Workout Duration: {avgWorkoutDuration.toFixed(2)}{" "}
                  min/workout
                </Text>
                <Text style={styles.statText}>
                  Calories Burned Per Week: {caloriesBurnedPerWeek} cal
                </Text>
              </View>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.chartTitle}>Your Personal Records (PR):</Text>
              </View>
              {/* PRs horizontally scrollable */}
              <ScrollView horizontal>
              <View style={styles.prContainer}>
              {/* Display max volume with exercise name */}
              {Object.keys(maxVolumePerExercise).map((exerciseId, index, array) => {
                const exerciseName = exerciseNames[exerciseId]; // Fetch exercise name from exerciseNames
                return (
                  <Text key={exerciseId} style={styles.prText}>
                    <Text style={{ fontWeight: 'bold' }}>{exerciseName ? capitalizeFirstLetter(exerciseName) : ''}</Text> - {maxVolumePerExercise[exerciseId].reps} reps x {maxVolumePerExercise[exerciseId].lbs} lbs.
                    {index !== array.length - 1 && ' | '}
                  </Text>
                );
              })}
            </View>
              </ScrollView>
            </View>
          </SafeAreaView>
        )}
      </ScrollView>
    </LinearBackground>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationsHeader: {
    fontSize: 26,
    fontWeight: "bold",
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 10,
    marginBottom: 20,
  },
  notificationsHeaderText: {
    fontSize: 26,
    fontWeight: "bold",
    marginLeft: 10,
  },
  notificationSettingsContainer: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
  },
  statText: {
    color: "white",
    fontSize: 15,
    marginBottom: 10,
  },
  chartContainer: {
    alignItems: "center",
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  chartTitle: {
    color: "white",
    fontSize: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
  },
  buttonText: {
    color: "#0044AA",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitleContainer: {
    borderTopWidth: 1,
    borderTopColor: '#FFFFFF',
    paddingTop: 10,
    paddingBottom: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  prContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  prText: {
    fontSize: 16,
    marginHorizontal: 5,
    color: 'white',
  },
});
