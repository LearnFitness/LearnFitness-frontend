import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert, StatusBar, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import { getBackendDataWithRetry, postBackendDataWithPhoto } from "../../utils/backendAPI";
import { useIsFocused } from '@react-navigation/native';
import AvatarPicker from "../../components/AvatarPicker";

export default function SettingsScreen() {
  const [userData, setUserData] = useState(null);
  const [photoObject, setPhotoObject] = useState({ uri: userData ? userData.photoURL : null });
  const [loading, setLoading] = useState(false);

  // Modifies status bar color ONLY on Settings screen
  function FocusAwareStatusBar(props) {
    const isFocused = useIsFocused();
    return isFocused ? <StatusBar {...props} /> : null;
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const userData = await getBackendDataWithRetry("/user");
        setUserData(userData);
        setPhotoObject({ uri: userData.photoURL })
      } catch (error) {
        Alert.alert("An error occurred", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleEditPhoto(photoObject) {
    setPhotoObject(photoObject);
    try {
      await postBackendDataWithPhoto("user/photo", { photoObject });
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  // Logout confirmation dialog
  // Note: styles only affect iOS
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            auth().signOut();
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar translucent backgroundColor="transparent" barStyle={"dark-content"} />
      <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
      </View>
      {loading || !userData ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.contentContainer}>
          {/* Profile picture, name, and email */}
          <View style={styles.profileContainer}>
            <AvatarPicker photoObject={{ uri: photoObject.uri }} setPhotoObject={handleEditPhoto} />
            <Text style={styles.profileName} >{userData.name.split(" ")[0]}</Text>
            <Text style={styles.profileEmail}>{userData.email}</Text>
          </View>
          <View style={styles.horizontalLine}></View>
          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            {/* To be implemented (User information like weight, height, etc.) */}
            <Pressable onPress={() => console.log("Edit profile")}>
              <View style={styles.buttonRow}>
                <Feather name="user" size={24} color="black" style={styles.icon} />
                <Text style={styles.button}>Edit Profile</Text>
              </View>
            </Pressable>
            {/* To be implemented */}
            <Pressable onPress={() => console.log("Notifications settings")}>
              <View style={styles.buttonRow}>
                <Feather name="bell" size={24} color="black" style={styles.icon} />
                <Text style={styles.button}>Notifications</Text>
              </View>
            </Pressable>
            <Pressable onPress={handleLogout}>
              <View style={styles.buttonRow}>
                <Feather name="log-out" size={24} color="black" style={styles.icon} />
                <Text style={styles.button}>Logout</Text>
              </View>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: "10%",
  },
  header: {
    alignSelf: "flex-start",
    marginTop: 40,
    marginLeft: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
    bottom: 60,
  },
  profileImageContainer: {
    position: "relative",
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 10,
    right: 20,
    backgroundColor: "#004A85",
    padding: 5,
    borderRadius: 20,
  },
  profileName: {
    marginTop: 10,
    fontSize: 22,
  },
  horizontalLine: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    marginTop: 20,
  },
  buttonsContainer: {
    alignSelf: "flex-start",
    marginLeft: "5%",
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    fontSize: 22,
    color: "#000000",
    marginTop: 30,
  },
  icon: {
    marginRight: 20,
    top: 17,
  },
  profileEmail: {
    marginTop: 5,
    fontSize: 17,
    color: "gray",
  },
});
