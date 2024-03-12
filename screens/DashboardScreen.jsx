import {View, Text, Button, ActivityIndicator} from "react-native";
import {useEffect, useState} from "react";
import {getBackendData} from "../utils/backendAPI";
import auth from "@react-native-firebase/auth";

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
    isLoading ? <ActivityIndicator/> : <View>
      <Text>Hello, {auth().currentUser.email}</Text>

      <Text>Your data: {data.name}</Text>

      <Button title="Sign Out" onPress={() => auth().signOut()}/>
    </View>
  )
}