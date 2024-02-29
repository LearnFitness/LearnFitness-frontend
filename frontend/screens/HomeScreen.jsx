import { StyleSheet, View, Text, Button } from "react-native";
import { supabase } from "../utils/supabase";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>HOME PAGE</Text>
      <View>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})