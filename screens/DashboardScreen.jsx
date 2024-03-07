import { View, Text, Button } from "react-native";
import auth from "@react-native-firebase/auth";
import axios from "axios";

async function testGetData() {
  try {
    const idToken = await auth().currentUser.getIdToken(true);
    const response = await axios.get("http://localhost:8080/users", {
      headers: {
        authorization: `bearer ${idToken}`
      }
    })
  
    console.log(response.data);

  } catch(error) {
    console.log(error);
  }
}

export default function DashboardScreen() {
  testGetData();
  
  return (
    <View>
      <Text>Hello, {auth().currentUser.email}</Text>

      <Button title="Sign Out" onPress={() => auth().signOut()} />
    </View>
  )
}