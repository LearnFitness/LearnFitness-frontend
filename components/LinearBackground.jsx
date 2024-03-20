import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { SafeAreaView } from "react-native";

export default function LinearBackground({ children, containerStyle }) {
  return (
    <View style={{flex: 1}}>
      <LinearGradient colors={['#002f51', '#004f40']} style={{ flex: 1 }} >
        <SafeAreaView style={[{flex: 1}, containerStyle]}>
          {children}
        </SafeAreaView>
      </LinearGradient>
    </View>
  )
}