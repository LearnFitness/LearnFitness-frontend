import React, { useContext, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import { Button } from '@rneui/themed';
import AvatarPicker from "../../components/AvatarPicker";
import auth from "@react-native-firebase/auth";
import LinearBackground from "../../components/LinearBackground";
import { SignUpContext } from "../../context/SignUpContext";

export default function SignUp1Screen({ navigation }) {
  const { signUpData, updateSignUpData } = useContext(SignUpContext);
  const [confirmPassword, setConfirmPassword] = useState();
  const [loading, setLoading] = useState(false);

  async function handleNext() {
    setLoading(true);

    if (!(signUpData.name && signUpData.email && signUpData.password)) {
      Alert.alert("Please fill out all required fields");
      setLoading(false);
      return;
    }

    // Check for valid password
    if (confirmPassword !== signUpData.password) {
      Alert.alert("Passwords do not match. Please try again");
      setLoading(false);
      return;
    }

    // Check for valid emails
    try {
      const signInMethods = await auth().fetchSignInMethodsForEmail(signUpData.email);
      if (signInMethods.length === 0) { // If this email is not registered yet
        navigation.navigate("SignUp2");
      } else {
        Alert.alert("Your email is already registered. Please try signing in.")
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  return (
    <LinearBackground style={styles.container}>
      <Text style={[styles.title]}>Create an Account</Text>

      <AvatarPicker photoObject={signUpData.photoObject} setPhotoObject={updateSignUpData} />

      <View style={{ paddingHorizontal: 40 }}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => updateSignUpData("name", text)}
          value={signUpData.name}
          placeholder="Your Name"
          autoCapitalize={"none"}
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => updateSignUpData("email", text)}
          value={signUpData.email}
          placeholder="Email"
          autoCapitalize={"none"}
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => updateSignUpData("password", text)}
          value={signUpData.password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          secureTextEntry={true}
          placeholder="Confirm Password"
          autoCapitalize={"none"}
        />
        <Button
          buttonStyle={styles.nextButton}
          loading={loading}
          disabled={loading}
          disabledStyle={{ backgroundColor: "gray" }}
          title="Next"
          onPress={() => handleNext()}
        />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText]}>Already a user?</Text>
        <Pressable onPress={() => navigation.navigate("SignIn")}>
          <Text style={{ fontSize: 17, color: "lightblue" }}> Login</Text>
        </Pressable>
      </View>
    </LinearBackground>
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