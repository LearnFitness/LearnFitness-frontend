import { View, Text, SafeAreaView, ActivityIndicator } from "react-native";
import { useState } from "react";
import LinearBackground from "../components/LinearBackground";

export default function WorkoutScreen() {
  const [isLoading, setIsLoading] = useState(true);

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