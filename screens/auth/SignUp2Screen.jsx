import React, { useState, useContext } from "react";
import { Alert, StyleSheet, Text, TextInput, View, Pressable, SafeAreaView } from "react-native";
import { Button } from '@rneui/themed';
import AvatarPicker from "../../components/AvatarPicker";
import auth from "@react-native-firebase/auth";
import LinearBackground from "../../components/LinearBackground";
import { SignUpContext } from "../../context/SignUpContext";

export default function SignUp1Screen({ route, navigation }) {
  const [birthday, setBirthday] = useState(null);
  const [height, setHeight] = useState(5.8);
  const [weight, setWeight] = useState(160);
  const [gender, setGender] = useState("male");
  const [loading, setLoading] = useState(false);

  const { signUpData, updateSignUpData } = useContext(SignUpContext);

  function handleNext() {
    setLoading(true);

    // TODO: Check for valid inputs

    // Navigate to next screen
    navigation.navigate("SignUp3");
  }

  return (
    <SafeAreaView style={styles.container}>

        <Text style={[styles.title]}>Create an Account</Text>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "500",
    textAlign: "center",
    marginTop: 50,
    marginHorizontal: 40,
    fontSize: 30,
    color: "white"
  },
  flex1: {
    flex: 1
  },
  nextButton: {
    backgroundColor: "#0494e8",
    height: 50,
    borderRadius: 30
  },
  input: {
    fontSize: 17,
    height: 50,
    backgroundColor: "white",
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 10
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  footerText: {
    color: "white",
    fontSize: 17
  }
})