import { View, Text, Button, ActivityIndicator, SafeAreaView } from "react-native";
import { useEffect, useState } from "react";
import { getBackendData } from "../utils/backendAPI";
import auth from "@react-native-firebase/auth";
import LinearBackground from "../components/LinearBackground";

export default function DashboardScreen() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getBackendData("/user");
        console.log(data);
        setData(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  return (
    <LinearBackground>
      <SafeAreaView>
        {isLoading ?
          (
            <ActivityIndicator />
          ) : (
            <View>
              <Text>Hello, {auth().currentUser.email}</Text>

              <Text>Your data: {data.email}</Text>

              <Button title="Sign Out" onPress={() => auth().signOut()} />
            </View>
          )
        }
      </SafeAreaView>
    </LinearBackground>
  )
}