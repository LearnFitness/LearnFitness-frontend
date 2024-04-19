import React, { useState, useContext, useEffect } from "react";
import { Alert, StyleSheet, Text, TextInput, View, SafeAreaView, ActivityIndicator, StatusBar } from "react-native";
import { ButtonGroup, Divider } from "@rneui/themed";
import { OnboardContext } from "../context/OnboardContext";
import SignUpInput from "../components/SignUpInput";
import PrimaryButton from "../components/PrimaryButton";
import { appStyles } from "../utils/styles";
import KeyboardAvoidView from "../components/KeyboardAvoidView";
import { getBackendData } from "../utils/backendAPI";
import AvatarPicker from "../components/AvatarPicker";
import auth from "@react-native-firebase/auth"
import LinearBackground from "../components/LinearBackground";

export default function Onboard1Screen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const { onboardData, updateOnboardData, updateMultipleOnboardData } = useContext(OnboardContext);
  const genders = ["Male", "Female", "Other"];

  useEffect(() => {
    updateMultipleOnboardData({ email: auth().currentUser.email, age: "25", height: "5.6", weight: "150", gender: "Male" });
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const userData = await getBackendData("/user");
        setUserData(userData);
      } catch (error) {
        Alert.alert("An error occured", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function handleNext() {
    setLoading(true);

    // TODO: Check for valid inputs

    // Navigate to next screen
    setLoading(false);
    navigation.navigate("Onboard2");
  }

  if (loading) {
    return (
      <LinearBackground>
        <ActivityIndicator style={{ flex: 1 }} />
      </LinearBackground>
    )
  }

  if (userData) {
    setTimeout(() => navigation.navigate("HomeNavigator"), 1);
  } else {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar translucent backgroundColor="transparent" barStyle={"dark-content"} />
        <KeyboardAvoidView containerStyle={styles.container}>
          <View>
            <Text style={[appStyles.heading1, { marginBottom: 10, marginTop: 10 }]}>Complete your sign up</Text>
            <Text style={[appStyles.heading4, { fontSize: 20 }]}>Let us know more about you to get your personal workout plans</Text>
          </View>

          <Text style={[appStyles.heading2, { fontSize: 24 }]}>Step 1 of 2</Text>

          <AvatarPicker photoObject={onboardData.photoObject} setPhotoObject={(photoObject) => updateOnboardData("photoObject", photoObject)} size={150} />

          <View>
            <SignUpInput
              title="Name"
              InputComponent={TextInput}
              onChangeText={(text) => updateOnboardData("name", text)}
              value={onboardData.name}
              placeholder="Your Name"
              autoCapitalize={"none"}
              style={{ fontSize: 17 }}
            />
            <Divider />
            <SignUpInput
              title="Age"
              InputComponent={TextInput}
              value={onboardData.age}
              onChange={(text) => updateOnboardData("age", text)}
              keyboardType="numeric"
              style={{ fontSize: 17 }}
            />
            <Divider />
            <SignUpInput
              title="Height (ft.in)"
              InputComponent={TextInput}
              value={onboardData.height}
              onChangeText={(text) => updateOnboardData("height", text)}
              keyboardType="numeric"
              style={{ fontSize: 17 }}
            />
            <Divider />
            <SignUpInput
              title="Weight (lbs)"
              InputComponent={TextInput}
              value={onboardData.weight}
              onChangeText={(text) => updateOnboardData("weight", text)}
              keyboardType="numeric"
              style={{ fontSize: 17 }}
            />
            <Divider />
            <SignUpInput
              title="Gender"
              InputComponent={ButtonGroup}
              flexDirection="column"
              buttons={genders}
              selectedIndex={genders.indexOf(onboardData.gender)}
              onPress={(index) => updateOnboardData("gender", genders[index])}
              containerStyle={{ borderRadius: 10 }}
              textStyle={{ fontSize: 17 }}
            />
          </View>
          <PrimaryButton title="Next" handleOnPress={handleNext} disabled={!onboardData.name}/>
        </KeyboardAvoidView>
      </SafeAreaView>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    marginHorizontal: "10%",
    marginTop: "5%"
  },
})
