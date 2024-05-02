import React, { useState, useContext, useEffect } from "react";
import { Alert, StyleSheet, Text, TextInput, View, SafeAreaView, ActivityIndicator, StatusBar, Platform } from "react-native";
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
import { useHeaderHeight } from '@react-navigation/elements';

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
    // Check if age is an integer
    const ageRegex = /^\d+$/;
    if (!ageRegex.test(onboardData.age)) {
      Alert.alert("Invalid Age", "Please enter a valid age.");
      return;
    }

    // Check if height is a float (optimal decimal point)
    const heightRegex = /^[0-9]+(\.[0-9]+)?$/;
    if (!heightRegex.test(onboardData.height)) {
      Alert.alert("Invalid Height", "Please enter a valid height.");
      return;
    }

    // Check if weight is an integer
    const weightRegex = /^\d+$/;
    if (!weightRegex.test(onboardData.weight)) {
      Alert.alert("Invalid Weight", "Please enter a valid weight.");
      return;
    }

    setLoading(true);

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
        <KeyboardAvoidView
          containerStyle={styles.container}
          keyboardVerticalOffset={useHeaderHeight}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View>
            <Text style={[appStyles.heading1, { marginBottom: 10, marginTop: 25 }]}>Complete your sign up</Text>
            <Text style={[appStyles.heading4, { fontSize: 17 }]}>Let us know more about you to get your personal workout plans</Text>
          </View>

          <Text style={[appStyles.heading2, { fontSize: 24, bottom: 25 }]}>Step 1 of 2</Text>

          <View style={{ alignItems: 'center', marginTop: -50 }}>
            <AvatarPicker photoObject={onboardData.photoObject} setPhotoObject={(photoObject) => updateOnboardData("photoObject", photoObject)} size={150} />
          </View>

          <View style={{ marginTop: -40 }}>
            <SignUpInput
              title="Name"
              InputComponent={TextInput}
              onChangeText={(text) => updateOnboardData("name", text)}
              value={onboardData.name}
              placeholder="Your Name"
              autoCapitalize={"none"}
              style={{ fontSize: 17, textAlign: 'right' }}
            />
            <Divider />
            <SignUpInput
              title="Age"
              InputComponent={TextInput}
              value={onboardData.age}
              onChangeText={(text) => updateOnboardData("age", text)}
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
          <View style={{ marginBottom: 15 }}>
            <PrimaryButton title="Next" handleOnPress={handleNext} disabled={!onboardData.name}/>
          </View>
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
