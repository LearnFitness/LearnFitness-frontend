import { View, Text, Button, ActivityIndicator, SafeAreaView, Alert, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { getBackendData } from "../../utils/backendAPI";
import auth from "@react-native-firebase/auth";
import LinearBackground from "../../components/LinearBackground";
import AvatarDisplay from "../../components/AvatarDisplay";

export default function DashboardScreen() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Dashboard mounted");
    async function fetchData() {
      try {
        const userData = await getBackendData("/user");
        setUserData(userData);
      } catch (error) {
        Alert.alert("An error occured", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <LinearBackground>
      <SafeAreaView>
        {isLoading || !userData ?
          (
            <ActivityIndicator />
          ) : (
            <View>
              <View style={styles.greetingContainer}>
                <View>
                  <Text style={styles.greetingText} >Good Morning,</Text>
                  <Text style={styles.greetingName} >{userData.name}</Text>
                </View>
                <AvatarDisplay source={{ uri: userData.photoURL }} size={120} editable={false} />
              </View>

              <Button title="Sign Out" onPress={() => auth().signOut()} />
            </View>
          )
        }
      </SafeAreaView>
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
    margin: 20
  },
  greetingText: {
    color: "white",
    fontSize: 25,
    fontStyle: "italic"
  },
  greetingName: {
    color: "white",
    fontSize: 40,
    fontWeight: "900"
  }
})