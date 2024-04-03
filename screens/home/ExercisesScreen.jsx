import { StyleSheet, Platform, StatusBar, View, Pressable } from "react-native";
import LinearBackground from "../../components/LinearBackground";
import ExercisesSearch from "../../components/ExercisesSearch";

const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

export default function ExercisesScreen() {
  return (
    <LinearBackground containerStyle={[styles.container, { paddingTop: statusBarHeight }]}>
      <ExercisesSearch />
    </LinearBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: "4%"
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 10,
  },
  filterButton: {
    padding: 10,
    top: 3,
  }
})
