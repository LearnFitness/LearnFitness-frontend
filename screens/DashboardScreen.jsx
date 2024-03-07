import { View, Text, Button } from "react-native";
import auth from "@react-native-firebase/auth";

export default function DashboardScreen() {
  return (
    <View>
      <Text>Hello, {auth().currentUser.email}</Text>
      
      <Button title="Sign Out" onPress={() => auth().signOut()} />
    </View>
  )
}