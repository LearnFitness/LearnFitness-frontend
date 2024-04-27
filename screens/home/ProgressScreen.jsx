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
  const [selected, setSelected] = useState("");
  const [completedWorkoutDates, setCompletedWorkoutDates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  // Getting user data
  useEffect(() => {
    // Listen for any changes to user document
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

  // Getting completed workout dates
  useEffect(() => {
    const unsubscribe = firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("sessions")
      .onSnapshot(snapshot => {
        const dates = {};
        snapshot.forEach(doc => {
          const session = doc.data();
          const sessionDate = new Date(session.date.seconds * 1000); 
          const year = sessionDate.getFullYear();
          const month = String(sessionDate.getMonth() + 1).padStart(2, '0');
          const day = String(sessionDate.getDate()).padStart(2, '0');
          const pstDateString = `${year}-${month}-${day}`;
          dates[pstDateString] = { marked: true };
        });
        setCompletedWorkoutDates(dates);
      });
    return () => unsubscribe();
  }, []);

  const toggleHistory = () => {
    setHistory(!showHistory);
  }
  return (
    <LinearBackground>
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} />
      ) : (
        <SafeAreaView>
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                // gap: 20,

                // margin: 20,
                margin: 10,
              }}
            >
              <Text style={{ color: "white", fontSize: 24, fontWeight: 600 }}>
                My Progress
              </Text>
              <Pressable onPress={() => navigation.navigate("Settings")}>
                <AvatarDisplay
                  source={
                    userData && userData.photoURL
                      ? { uri: userData.photoURL }
                      : null
                  }
                  size={60}
                  editable={false}
                  clickable={false}
                />
              </Pressable>
            </View>
            <View
              style={{
                backgroundColor: "rgb(34,84,150)",
                marginHorizontal: 125,
              }}
            >
              <Button
                title="See History"
                color="white"
                onPress={toggleHistory}
              />
            </View>
            <Modal
              animationType="slide"
              // transparent={true}
              visible={showHistory}
              onRequestClose={toggleHistory}
            >
              <SafeAreaView style={styles.modalContainer}>
                <View style={styles.notificationSettingsContainer}>
                  <View style={styles.notificationsHeader}>
                    <Pressable onPress={toggleHistory}>
                      <Feather name="arrow-left" size={26} color="black" />
                    </Pressable>
                    <Text style={styles.notificationsHeader}> History</Text>
                  </View>
                  <CalendarList
                    onDayPress={(day) => {
                      console.log("selected day", day);
                    }}
                    // Mark specific dates as marked
                    markedDates={completedWorkoutDates}
                  />
                </View>
              </SafeAreaView>
            </Modal>

            <Text style={{ color: "white" }}>Bezier Line Chart</Text>
            <LineChart
              data={{
                labels: [
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                ],
                datasets: [
                  {
                    data: [
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                    ],
                  },
                ],
              }}
              width={Dimensions.get("window").width} // from react-native
              height={220}
              yAxisLabel="$"
              yAxisSuffix="k"
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
        </SafeAreaView>
      )}
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
  
  notificationSettingsContainer: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
  },

});
