import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { SafeAreaView } from "react-native";

export default function LinearBackground({ children, containerStyle, safeAreaView = true }) {
  return (
    <LinearGradient colors={['#00223B', '#003D42']} style={[{ flex: 1 }, safeAreaView ? null : containerStyle]} >
      {safeAreaView ?
        <SafeAreaView style={[{ flex: 1 }, containerStyle]}>
          {children}
        </SafeAreaView>
        :
        children}
    </LinearGradient>
  )
}