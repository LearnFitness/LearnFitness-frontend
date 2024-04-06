import { Modal, Text, View, Pressable } from "react-native";
import ExercisesSearch from "./ExercisesSearch";
import LinearBackground from "./LinearBackground";

export default function ExercisesSearchModal({ isModalVisible, setModalVisible }) {
  return (
    <Modal animationType="slide" presentationStyle="pageSheet" visible={isModalVisible}>
      <LinearBackground containerStyle={{marginHorizontal: "4%"}}>
        <Pressable onPress={() => setModalVisible(false)}>
          <Text style={{ textAlign: "right", fontSize: 20, marginTop: 20, color: "crimson" }}>Close</Text>
        </Pressable>
        <ExercisesSearch />
      </LinearBackground>
    </Modal>
  )
}