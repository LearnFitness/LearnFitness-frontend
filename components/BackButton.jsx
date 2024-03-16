import { View, Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome6";

export default function BackButton({ handleOnPress, name = "arrow-left", size = 20, color = "white" }) {
  return (
    <View style={{ alignSelf: "flex-start" }}>
      <FontAwesome name={name} size={size} color={color} onPress={handleOnPress} />
    </View>
  )
}