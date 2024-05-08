import { Text, TouchableOpacity } from "react-native";
import ExercisesSearch from "./ExercisesSearch";
import LinearBackground from "./LinearBackground";

export default function ExercisesSearchModal({ navigation }) {
  return (
    <LinearBackground containerStyle={{ marginHorizontal: "4%" }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ textAlign: "right", fontSize: 20, marginTop: 40, color: "crimson" }}>Close</Text>
      </TouchableOpacity>
      <ExercisesSearch />
    </LinearBackground>
  )
}
