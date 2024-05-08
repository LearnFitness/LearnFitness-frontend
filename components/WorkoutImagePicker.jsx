import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View, StyleSheet, ScrollView } from "react-native";
import firestore from "@react-native-firebase/firestore";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Divider } from "@rneui/themed";

export default function WorkoutImagePicker({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        const imagesSnapshot = await firestore().collection("workout_images").get();
        setImages(imagesSnapshot.docs);
      } catch (error) {
        Alert.alert(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, []);

  function handlePickImage(imageDoc) {
    const image = { data: { ...imageDoc.data() }, id: imageDoc.id }
    const routes = navigation.getState().routes;

    if (routes.find(route => route.name === "AddWorkoutScreen")) {
      const parentScreen = routes.find(route => route.name === "AddWorkoutScreen");
      const action = parentScreen.params.action;
      navigation.navigate("AddWorkoutScreen", { image, headerTitle: action === "edit" ? "Edit workout" : "Create workout", action });
    }
    else if (routes.find(route => route.name === "StartWorkoutScreen")) {
      const parentScreen = routes.find(route => route.name === "StartWorkoutScreen");
      const action = parentScreen.params.action;
      navigation.navigate("StartWorkoutScreen", { image, headerTitle: action === "edit" ? "Edit completed workout" : "Start workout", action });
    }
  }

  const renderImages = () => {
    if (loading) {
      return <ActivityIndicator style={{ flex: 1 }} />;
    } else {
      const placeholders = [];
      const fillCount = 3 - (images.length % 3);
      if (fillCount < 3) {
        for (let i = 0; i < fillCount; i++) {
          placeholders.push(<View key={`placeholder-${i}`} style={{ width: "33%", aspectRatio: 1, padding: 2 }} />);
        }
      }
      return (
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around" }}>
          {images.map(image => (
            <TouchableOpacity key={image.id} style={{ width: "33%", aspectRatio: 1, padding: 2 }} onPress={() => handlePickImage(image)}>
              <Image source={{ uri: image.data().url }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
            </TouchableOpacity>
          ))}
          {placeholders}
        </View>
      );
    }
  }

  return (
    <>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        <Text style={styles.titleText}>Pick an image</Text>
        {loading ? null : <AntDesign name="close" color="grey" size={22} style={{ position: "absolute", right: 20 }} onPress={() => navigation.goBack()} />}
      </View>
      <Divider />
      <ScrollView>
        {renderImages()}
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 18,
    fontWeight: "500",
    margin: 20,
    textAlign: "center"
  },
});
