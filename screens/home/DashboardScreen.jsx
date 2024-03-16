import { View, Text, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { getBackendDataWithRetry } from "../../utils/backendAPI";
import auth from "@react-native-firebase/auth";
import LinearBackground from "../../components/LinearBackground";
import AvatarDisplay from "../../components/AvatarDisplay";
import PrimaryButton from "../../components/PrimaryButton";

export default function DashboardScreen() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getBackendDataWithRetry("/user");
        setUserData(userData);
        console.log(userData);
      } catch (error) {
        Alert.alert("An error occured", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function updateUser() {
      await auth().currentUser.updateProfile({
        displayName: "",
        photoURL: ""
      })
    }
  }, [])

  return (
    <LinearBackground>
      {loading || !userData ?
        (
          <ActivityIndicator style={{flex: 1}}/>
        ) : (
          <View>
            <View style={styles.greetingContainer}>
              <View>
                <Text style={styles.greetingText} >Good Morning,</Text>
                <Text style={styles.greetingName} >{userData.name}</Text>
              </View>
              <AvatarDisplay source={{ uri: userData.photoURL }} size={120} editable={false} />
            </View>
            <PrimaryButton title="Sign Out" handleOnPress={() => auth().signOut()} />
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