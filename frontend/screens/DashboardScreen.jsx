import { View, Text, Button } from "react-native";
import { supabase } from "../utils/supabase";

export default function DashboardScreen() {
  return (
    <View>
      <Text>Dashboard</Text>
      <Button title="Sign Out" onPress={() => supabase.auth.signOut()}/>
    </View>
  )
}