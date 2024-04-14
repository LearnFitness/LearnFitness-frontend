import { Modal, View, Text, Pressable, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import FastImage from "react-native-fast-image";
import { FAB, Divider } from "@rneui/themed";
import { useState } from "react";
import Ionicon from "react-native-vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import toast from "../utils/toast";

export const WorkoutModal = ({ workout, navigation, isWorkoutModalVisible, handleCloseModal }) => {
  const [isMenuVisible, setMenuVisible] = useState(false);

  function closeModal() {
    setMenuVisible(false);
    handleCloseModal();
  }

  function handleEditWorkout() {
    handleCloseModal();
    navigation.navigate("AddWorkoutScreen", { workout, headerTitle: "Edit workout", action: "edit" });
  };

  function handleDeleteWorkout() {
    Alert.alert(
      "Delete this workout?",
      "This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteWorkout
        }
      ]
    )

    async function deleteWorkout() {
      try {
        console.log("deleting workout id", workout.id)
        await firestore()
          .collection('users')
          .doc(auth().currentUser.uid)
          .collection('workouts')
          .doc(workout.id)
          .delete();
        toast("Workout deleted");
      } catch (error) {
        Alert.alert(error.message);
      } finally {
        handleCloseModal();
      }
    };
  }

  async function handleDuplicateWorkout() {
    try {
      await firestore()
        .collection('users')
        .doc(auth().currentUser.uid)
        .collection('workouts')
        .add({
          name: workout.name,
          description: workout.description,
          exercises: workout.exercises
        });
      toast("Workout duplicated");
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      handleCloseModal();
    }
  };

  function handleStartWorkout() {
    navigation.navigate("StartWorkoutScreen", { workout });
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isWorkoutModalVisible}
      onRequestClose={closeModal}
    >
      <Pressable style={styles.modalContainer} onPress={closeModal}>
        <BlurView intensity={20} style={{ flex: 1, width: "100%", alignItems: "center", justifyContent: "center" }}>
        </BlurView>
      </Pressable>
      <View style={styles.modalContent}>
        <FAB
          title="Edit"
          visible={isMenuVisible}
          icon={{ name: 'edit', color: 'white' }}
          size="small"
          style={{ position: "absolute", top: -45 }}
          onPress={handleEditWorkout}
          color="royalblue"
        />
        <FAB
          title="Delete"
          visible={isMenuVisible}
          icon={{ name: 'delete', color: 'white' }}
          size="small"
          style={{ position: "absolute", top: -90 }}
          onPress={handleDeleteWorkout}
          color="royalblue"
        />
        <FAB
          title="Duplicate"
          visible={isMenuVisible}
          icon={{ name: 'add', color: 'white' }}
          size="small"
          style={{ position: "absolute", top: -135 }}
          onPress={handleDuplicateWorkout}
          color="royalblue"
        />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Ionicon name={isMenuVisible ? "close" : "menu"} color="grey" size={27} onPress={() => setMenuVisible(!isMenuVisible)} />
          <Text style={styles.modalHeader}>{workout?.name}</Text>
          <Ionicon name="close-circle-outline" color="#aa3155" size={27} onPress={closeModal} />
        </View>
        <Divider style={{ marginTop: 5 }} />
        <ScrollView>
          {workout?.exercises.map((exercise, index) => (
            <View key={index} style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
              {exercise.gifUrl ? <FastImage source={{ uri: exercise.gifUrl }} style={{ width: 60, height: 60 }} /> : null}
              <View style={styles.exerciseDetails} key={exercise.id}>
                <Text style={styles.exerciseSet}>{exercise.sets} x {exercise.name}</Text>
                <Text style={styles.exerciseTarget}>{exercise.target}</Text>
              </View>
            </View>

          ))}
        </ScrollView>

        <TouchableOpacity onPress={handleStartWorkout} style={styles.startButton}>
          <Text style={{ fontSize: 18, color: "white", fontWeight: "600" }}>Start workout</Text>
        </TouchableOpacity>
      </View>

    </Modal>
  );
};


const styles = StyleSheet.create({
  container: {
    marginHorizontal: "6%"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 25,
    marginBottom: 10
  },
  workoutsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  workoutItemContainer: {
    overflow: "hidden",
    width: "47%",
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 1)",
    marginBottom: 10
  },
  workoutImage: {
    width: '100%',
    height: 170,
    alignSelf: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  workoutDetailsContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10
  },
  workoutName: {
    fontSize: 18,
    fontWeight: "700"
  },
  showMoreButton: {
    paddingVertical: 5,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 0,
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "teal"
  },
  addButtonText: {
    color: "rgba(0, 0, 0, 0.3)",
    fontSize: 30,
    fontWeight: "bold",
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)"
  },
  modalContent: {
    marginHorizontal: "10%",
    marginVertical: 200,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    maxWidth: "80%"
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  startButton: {
    backgroundColor: "teal",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  exerciseDetails: {
    marginHorizontal: 5,
    maxWidth: "80%"
  },
  exerciseSet: {
    fontSize: 16,
  },
  exerciseTarget: {
    color: "darkgrey",
    fontSize: 16,
    textTransform: "capitalize"
  }
});
