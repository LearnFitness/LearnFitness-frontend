import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, ActivityIndicator, StyleSheet, Alert, StatusBar, Pressable, Modal, Switch } from "react-native";
import { Feather } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import { getBackendDataWithRetry, postBackendDataWithPhoto } from "../../utils/backendAPI";
import { useIsFocused } from '@react-navigation/native';
import AvatarPicker from "../../components/AvatarPicker";

export default function SettingsScreen() {
  const [userData, setUserData] = useState(null);
  const [photoObject, setPhotoObject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

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

  const toggleNotificationSettings = () => {
    setShowNotificationSettings(!showNotificationSettings);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FocusAwareStatusBar translucent backgroundColor="transparent" barStyle={"dark-content"} />
      <SafeAreaView style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
      </SafeAreaView>
      {loading || !userData ? (
        <ActivityIndicator />
      ) : (
        <SafeAreaView style={styles.contentContainer}>
          {/* Profile picture, name, and email */}
          <SafeAreaView style={styles.profileContainer}>
            <AvatarPicker photoObject={photoObject.uri ? { uri: photoObject.uri } : null} setPhotoObject={handleEditPhoto} />
            <Text style={styles.profileName} >{userData.name.split(" ")[0]}</Text>
            <Text style={styles.profileEmail}>{userData.email}</Text>
          </SafeAreaView>
          <SafeAreaView style={styles.horizontalLine}></SafeAreaView>
          {/* Buttons */}
          <SafeAreaView style={styles.buttonsContainer}>
            {/* To be implemented (User information like weight, height, etc.) */}
            <Pressable onPress={() => console.log("Edit profile")}>
              <SafeAreaView style={styles.buttonRow}>
                <Feather name="user" size={24} color="black" style={styles.icon} />
                <Text style={styles.button}>Edit Profile</Text>
              </SafeAreaView>
            </Pressable>
            {/* Notifications settings */}
            <Pressable onPress={toggleNotificationSettings}>
              <SafeAreaView style={styles.buttonRow}>
                <Feather name="bell" size={24} color="black" style={styles.icon} />
                <Text style={styles.button}>Notifications</Text>
              </SafeAreaView>
            </Pressable>
            {/* Logout button */}
            <Pressable onPress={handleLogout}>
              <SafeAreaView style={styles.buttonRow}>
                <Feather name="log-out" size={24} color="black" style={styles.icon} />
                <Text style={styles.button}>Logout</Text>
              </SafeAreaView>
            </Pressable>
          </SafeAreaView>
        </SafeAreaView>
      )}
      {/* Notifications settings tab */}
      <Modal
      animationType="slide"
      transparent={true}
      visible={showNotificationSettings}
      onRequestClose={toggleNotificationSettings}>
      <SafeAreaView style={styles.modalContainer}>
        <SafeAreaView style={styles.notificationSettingsContainer}>
          <SafeAreaView style={styles.notificationsHeader}>
            <Pressable onPress={toggleNotificationSettings}>
              <Feather name="arrow-left" size={26} color="black" />
            </Pressable>
            <Text style={styles.notificationsHeader}>   Notifications</Text>
          </SafeAreaView>
          {/* Buttons */}
          <SafeAreaView style={styles.notificationSettings}>
            <Text style={styles.notificationText}>General notifications</Text>
            <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
          </SafeAreaView>
          <SafeAreaView style={styles.notificationSettings}>
            <Text style={styles.notificationText}>Sound</Text>
            <Switch value={soundEnabled} onValueChange={setSoundEnabled} />
          </SafeAreaView>
          <SafeAreaView style={styles.notificationSettings}>
            <Text style={styles.notificationText}>Vibration</Text>
            <Switch value={vibrationEnabled} onValueChange={setVibrationEnabled} />
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>
    </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: "10%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 26,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 40,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
    bottom: 40,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationsHeader: {
    fontSize: 26,
    fontWeight: "bold",
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 10,
    marginBottom: 20,
  },
  notificationSettingsContainer: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    paddingHorizontal: 30,
  },
  notificationSettings: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  notificationText: {
    fontSize: 20,
  },
});
