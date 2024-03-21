import React, { useState, useContext, useEffect } from "react";
import { Alert, StyleSheet, Text, TextInput, View, SafeAreaView, ActivityIndicator } from "react-native";
import { ButtonGroup, Divider } from "@rneui/themed";
import { OnboardContext } from "../context/OnboardContext";
import DateTimePicker from '@react-native-community/datetimepicker';
import SignUpInput from "../components/SignUpInput";
import PrimaryButton from "../components/PrimaryButton";
import { appStyles } from "../utils/styles";
import KeyboardAvoidView from "../components/KeyboardAvoidView";
import { getBackendData } from "../utils/backendAPI";
import AvatarPicker from "../components/AvatarPicker";
import auth from "@react-native-firebase/auth"
import LinearBackground from "../components/LinearBackground";

export default function Onboard1Screen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const { onboardData, updateOnboardData, updateMultipleOnboardData } = useContext(OnboardContext);
  const genders = ["Male", "Female", "Other"];

  useEffect(() => {
    updateMultipleOnboardData({ email: auth().currentUser.email, birthday: new Date(), height: "5.6", weight: "150", gender: "Male" });
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
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
  } else {
    if (userData) {
      // return (
      //   <LinearBackground>
      //     <ActivityIndicator style={{ flex: 1 }} />
      //     {navigation.navigate("HomeNavigator")}
      //   </LinearBackground>)
      navigation.navigate("HomeNavigator");
    } else {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidView containerStyle={styles.container}>
            <View>
              <Text style={[appStyles.heading1, { marginBottom: 20 }]}>Complete your signup</Text>
              <Text style={appStyles.heading4}>Let us know more about you to get your personal workout plans</Text>
            </View>

            <Text style={appStyles.heading2}>Step 1 of 2</Text>

            <AvatarPicker photoObject={onboardData.photoObject} setPhotoObject={updateOnboardData} size={150} />

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
                title="Birthday"
                InputComponent={DateTimePicker}
                value={onboardData.birthday}
                onChange={(event, date) => updateOnboardData("birthday", date)}
              />
              <Divider />
              <SignUpInput
                title="Height"
                InputComponent={TextInput}
                value={onboardData.height}
                onChangeText={(text) => updateOnboardData("height", text)}
                keyboardType="numeric"
                style={{ fontSize: 17 }}
              />
              <Divider />
              <SignUpInput
                title="Weight"
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
            <PrimaryButton title="Next" handleOnPress={handleNext} />
          </KeyboardAvoidView>
        </SafeAreaView>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    marginHorizontal: "10%",
    marginTop: "5%"
  },
})