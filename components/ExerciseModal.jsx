import { Button, Modal, View, Text, StyleSheet, ScrollView } from "react-native";
import FastImage from "react-native-fast-image";
import { Divider } from "@rneui/themed";

export default function ExerciseModal({ exercise, isModalVisible, setModalVisible }) {
  return (
    <Modal animationType="slide" presentationStyle="pageSheet" visible={isModalVisible}>
      <View style={styles.buttonsContainer}>
        <Button title="Add to Workout" />
        <Button title="Close" onPress={() => setModalVisible(false)} />
      </View>
      <Divider />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.exerciseName}>{exercise?.name}</Text>
        <FastImage style={styles.exerciseGif} source={{ uri: exercise?.gifUrl }} />

        <View style={styles.keyValueRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.exerciseKey}>Body part</Text>
            <Text style={styles.exerciseValue}>{exercise?.bodyPart}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.exerciseKey}>Equipment</Text>
            <Text style={styles.exerciseValue}>{exercise?.equipment}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.exerciseKey}>Target muscle</Text>
            <Text style={styles.exerciseValue}>{exercise?.target}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.exerciseKey}>Secondary muscles</Text>
            <View style={styles.exerciseValue}>
              {exercise?.secondaryMuscles.map((muscle, index) => {
                return <Text key={index} style={styles.exerciseValue}>{muscle}</Text>
              })}
            </View>
          </View>
        </View>
        <View>
          <Divider style={{padding: 10}}/>
          <Text style={styles.instructions}>Instructions</Text>
          {exercise?.instructions.map((instruction, index) => {
            return <Text style={styles.instructionStep} key={index}>{(index + 1) + ". " + instruction}</Text>
          })}
        </View>
      </ScrollView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center"
  },
  exerciseName: {
    fontSize: 25,
    fontWeight: "600",
    textAlign: "center",
    textTransform: "capitalize"
  },
  exerciseGif: {
    width: 250,
    height: 250,
  },
  keyValueRow: {
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  exerciseKey: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "300",
    color: "darkgrey",
    marginTop: 20,
    marginBottom: 5
  },
  exerciseValue: {
    textAlign: "center",
    fontSize: 20,
  },
  instructions: {
    margin: 10,
    fontSize: 22,
    fontWeight: "600"
  },
  instructionStep: {
    margin: 10,
    fontSize: 17,
    color: "darkgrey"
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 15
  }
})