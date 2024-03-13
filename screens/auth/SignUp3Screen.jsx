import React, { useContext, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import { Button } from '@rneui/themed';
import auth from "@react-native-firebase/auth";
import { postDataWithProfileImage } from "../../utils/backendAPI";
import { SignUpContext } from "../../context/SignUpContext";

export default function SignUpScreen({ navigation }) {

  const { signUpData, updateSignUpData } = useContext(SignUpContext);
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView style={styles.container}>

      <Text style={[styles.title]}>Step 2 of 2</Text>
      
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
  signUpButton: {
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