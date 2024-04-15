import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Ionicon from "react-native-vector-icons/Ionicons";

export default function ExerciseSets({ exercise }) {
  const [sets, setSets] = useState(exercise.sets ? exercise.sets : 1);
  const navigation = useNavigation();

  const handleAddSet = () => {
    exercise.sets += 1;
    setSets(sets => sets + 1);
  };

  const handleRemoveSet = (index) => {
    exercise.sets -= 1;
    if (sets > 1) {
      setSets(sets => sets - 1);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("ExerciseModal", { exerciseId: exercise.id })}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
      </TouchableOpacity>
      <Text style={styles.exerciseTarget}>{exercise.target}</Text>
      <View style={styles.exerciseHeader}>
        <Text style={[{ flex: 1, marginLeft: 15 }, styles.exerciseHeaderText]}>Set</Text>
        <Text style={[{ flex: 2 }, styles.exerciseHeaderText]}>lbs</Text>
        <Text style={[{ flex: 2 }, styles.exerciseHeaderText]}>Reps</Text>
      </View>
      <View>
        {[...Array(sets)].map((value, index) => {
          return (
            <View style={styles.exerciseSet} key={index}>
              <Ionicon
                name="remove-circle-outline"
                color="#aa3155"
                size={17}
                onPress={() => handleRemoveSet(index)}
              />
              <Text style={{ flex: 1, textAlign: "center", fontSize: 15 }}>{index + 1}</Text>
              <TextInput keyboardType="numeric" style={[{ flex: 2 }, styles.exerciseInput]} />
              <TextInput keyboardType="numeric" style={[{ flex: 2 }, styles.exerciseInput]} />
            </View>
          );
        })}
      </View>
      <TouchableOpacity style={styles.addSetButton} onPress={handleAddSet}>
        <Text style={styles.addSetButtonText}>+ Add Set</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginTop: 15
  },
  exerciseName: {
    color: "blue",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    textTransform: "capitalize",
    marginBottom: 5,
    marginHorizontal: "5%"
  },
  exerciseTarget: {
    color: "grey",
    textAlign: "center",
    textTransform: "capitalize",
    marginBottom: 5
  },
  exerciseHeader: {
    flexDirection: "row",
  },
  exerciseHeaderText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    alignItems: "center"
  },
  exerciseSet: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5
  },
  exerciseInput: {
    textAlign: "center",
    backgroundColor: "rgb(245, 245, 245)",
    padding: 3,
    marginHorizontal: 3,
    borderRadius: 5,
    fontSize: 15
  },
  addSetButton: {
    alignSelf: "center",
    backgroundColor: "lightgrey",
    width: "40%",
    padding: 3,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5
  }
});
