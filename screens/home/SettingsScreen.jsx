import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useState } from "react";
import LinearBackground from "../../components/LinearBackground";
import PrimaryButton from "../../components/PrimaryButton";
import auth from "@react-native-firebase/auth"

export default function SettingsScreen() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LinearBackground containerStyle={styles.container}>
      {isLoading ?
        (
          <ActivityIndicator />
        ) : (
          <View>
            <PrimaryButton title="Sign Out" handleOnPress={() => auth().signOut()} />
          </View>
        )
      }
    </LinearBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: "10%"
  }
})