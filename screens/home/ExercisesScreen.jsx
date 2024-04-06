import { StyleSheet, Platform, StatusBar, View, Pressable } from "react-native";
import LinearBackground from "../../components/LinearBackground";
import ExercisesSearch from "../../components/ExercisesSearch";

const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

export default function ExercisesScreen() {
  return (
    <LinearBackground containerStyle={styles.container}>
      <ExercisesSearch />
    </LinearBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: "4%",
    paddingTop: statusBarHeight
  },
})
