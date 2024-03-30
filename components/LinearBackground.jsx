import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { SafeAreaView } from "react-native";

export default function LinearBackground({ children, containerStyle }) {
  return (
    <View style={{flex: 1}}>
      <LinearGradient colors={['#00223B', '#003D42']} style={{ flex: 1 }} >
        <SafeAreaView style={[{flex: 1}, containerStyle]}>
          {children}
        </SafeAreaView>
      </LinearGradient>
    </View>
  )
}