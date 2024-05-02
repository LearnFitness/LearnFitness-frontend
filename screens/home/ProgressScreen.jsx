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
} from "react-native";
import LinearBackground from "../../components/LinearBackground";
import auth from "@react-native-firebase/auth";
import { Feather } from "@expo/vector-icons";
import AvatarDisplay from "../../components/AvatarDisplay";
import firestore from "@react-native-firebase/firestore";
import { Calendar, CalendarList } from "react-native-calendars";
import { getBackendDataWithRetry } from "../../utils/backendAPI"
import { useEffect, useState } from "react";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

export default function ProgressScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showHistory, setHistory] = useState(false);
  const [completedWorkoutDates, setCompletedWorkoutDates] = useState({});
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [avgWorkoutsPerWeek, setAvgWorkoutsPerWeek] = useState(0);
  const [avgWorkoutDuration, setAvgWorkoutDuration] = useState(0);
  const [caloriesBurnedPerWeek, setCaloriesBurnedPerWeek] = useState(0);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .onSnapshot(() => {
        async function fetchData() {
          setLoading(true);
          try {
            const userData = await getBackendDataWithRetry('/user');
            setUserData(userData);
          } catch (error) {
            Alert.alert('An error occurred', error.message);
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
      .collection('users')
      .doc(auth().currentUser.uid)
      .collection('sessions')
      .onSnapshot(snapshot => {
        const dates = {};
        let totalWorkouts = 0;
        let totalDuration = 0;
        snapshot.forEach(doc => {
          const session = doc.data();
          const sessionDate = new Date(session.date.seconds * 1000);
          const year = sessionDate.getFullYear();
          const month = String(sessionDate.getMonth() + 1).padStart(2, '0');
          const day = String(sessionDate.getDate()).padStart(2, '0');
          const pstDateString = `${year}-${month}-${day}`;
          dates[pstDateString] = { marked: true };
          totalWorkouts++;
          totalDuration += session.duration;
        });
        setCompletedWorkoutDates(dates);
        setTotalWorkouts(totalWorkouts);

        const firstSessionDate = Object.keys(dates).length > 0 ? new Date(Object.keys(dates)[0]) : new Date();
        const daysBetween = Math.ceil((new Date() - firstSessionDate) / (1000 * 60 * 60 * 24));
        const weeksBetween = Math.ceil(daysBetween / 7);
        const avgWorkoutsPerWeek = totalWorkouts / weeksBetween;
        setAvgWorkoutsPerWeek(avgWorkoutsPerWeek.toFixed(2));

        const avgDuration = totalDuration / totalWorkouts;
        setAvgWorkoutDuration(avgDuration / 60);

        // Calculate calories burned per week
        const caloriesBurned = (totalWorkouts * 400)/ weeksBetween;
        setCaloriesBurnedPerWeek(caloriesBurned);
      });
    return () => unsubscribe();
  }, []);

  const toggleHistory = () => {
    setHistory(!showHistory);
  };

  return (
    <LinearBackground>
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} />
      ) : (
        <SafeAreaView>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 20, marginTop: 40 }}>
              <Text style={{ color: 'white', fontSize: 24, fontWeight: '600' }}>My Progress</Text>
              <Pressable onPress={() => navigation.navigate('Settings')}>
                <AvatarDisplay source={userData && userData.photoURL ? { uri: userData.photoURL } : null} size={60} editable={false} clickable={false} />
              </Pressable>
            </View>
            <View style={{ backgroundColor: 'rgb(34,84,150)', marginHorizontal: 125 }}>
              <Button title="See History" color="#0094FF" onPress={toggleHistory} />
            </View>
            <Modal animationType="slide" visible={showHistory} onRequestClose={toggleHistory}>
              <SafeAreaView style={styles.modalContainer}>
                <View style={styles.notificationSettingsContainer}>
                  <View style={styles.notificationsHeader}>
                    <Pressable onPress={toggleHistory}>
                      <Feather name="arrow-left" size={26} color="black" />
                    </Pressable>
                    <Text style={styles.notificationsHeaderText}>History</Text>
                  </View>
                  <CalendarList
                    onDayPress={day => console.log('selected day', day)}
                    markedDates={completedWorkoutDates}
                  />
                </View>
              </SafeAreaView>
            </Modal>

            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text style={styles.statText}>Total Workouts Completed: {totalWorkouts}</Text>
              <Text style={styles.statText}>Average Workouts Per Week: {avgWorkoutsPerWeek}</Text>
              <Text style={styles.statText}>Average Workout Duration: {avgWorkoutDuration.toFixed(2)} min/workout</Text>
              <Text style={styles.statText}>Calories Burned Per Week: {caloriesBurnedPerWeek} cal</Text>
            </View>

            {/* Display Bar Chart */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Weekly Workout Summary</Text>
              <BarChart
                data={{
                  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  datasets: [{ data: [30, 40, 35, 45, 50, 55, 40] }], // Example data for time spent (in minutes) per day
                }}
                width={350}
                height={220}
                yAxisSuffix=" min"
                chartConfig={{
                  backgroundColor: '#1cc910',
                  backgroundGradientFrom: '#eff3ff',
                  backgroundGradientTo: '#efefef',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: { borderRadius: 15 },
                  propsForLabels: {
                    fontFamily: 'Arial',
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
          </View>
        </SafeAreaView>
      )}
    </LinearBackground>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationsHeader: {
    fontSize: 26,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 10,
    marginBottom: 20,
  },
  notificationsHeaderText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  notificationSettingsContainer: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
  },
  statText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  chartTitle: {
    color: 'white',
    fontSize: 20,
    marginBottom: 10,
  },
});
