import { View, Text, SafeAreaView, ActivityIndicator } from "react-native";
import { useState } from "react";
import LinearBackground from "../../components/LinearBackground";

export default function ProgressScreen() {
  const [loading, setLoading] = useState(true);
  return (
    <LinearBackground>
      <SafeAreaView>
        {loading ?
          (
            <ActivityIndicator style={{ flex: 1 }} />
          ) : (
            <View>
            </View>
          )
        }
      </SafeAreaView>
    </LinearBackground>
  )
}