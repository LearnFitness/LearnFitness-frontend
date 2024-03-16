import React, { useContext, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import AvatarPicker from "../../components/AvatarPicker";
import auth from "@react-native-firebase/auth";
import LinearBackground from "../../components/LinearBackground";
import KeyboardAvoidView from "../../components/KeyboardAvoidView";
import PrimaryButton from "../../components/PrimaryButton"
import { OnboardContext } from "../../context/OnboardContext";
import { appStyles } from "../../utils/styles";

export default function SignUpScreen({ navigation, route }) {
  // const { signUpData, updateSignUpData } = useContext(SignUpContext);
  const [confirmPassword, setConfirmPassword] = useState();
  const [loading, setLoading] = useState(false);

  // Create a new Date object for the next SignUp screen
  // useEffect(() => {
  //   updateSignUpData("birthday", new Date());
  // }, [])

  // async function handleNext() {
  //   setLoading(true);

  //   if (!(signUpData.name && signUpData.email && signUpData.password)) {
  //     Alert.alert("Please fill out all required fields");
  //     setLoading(false);
  //     return;
  //   }

  //   // Check for valid password
  //   if (confirmPassword !== signUpData.password) {
  //     Alert.alert("Passwords do not match. Please try again");
  //     setLoading(false);
  //     return;
  //   }

  //   // Check for valid emails
  //   try {
  //     const signInMethods = await auth().fetchSignInMethodsForEmail(signUpData.email);
  //     if (signInMethods.length === 0) { // If this email is not registered yet
  //       updateSignUpData("externalCredential", null);
  //       navigation.navigate("SignUp2");
  //     } else {
  //       Alert.alert("This email is already registered. Please try signing in.");
  //       return;
  //     }
  //   } catch (error) {
  //     Alert.alert(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // }
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  async function handleSignUp() {
    setLoading(true);
    try {
      await auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearBackground>
      <KeyboardAvoidView containerStyle={styles.container}>
        <View style={{ marginTop: "50%" }}>
          <Text style={[appStyles.heading1, { color: "white", marginBottom: "20%"}]}>Create a LearnFitness account</Text>
          <TextInput
            style={appStyles.input}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="Email"
            autoCapitalize={"none"}
          />
          <TextInput
            style={appStyles.input}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={"none"}
          />
          <TextInput
            style={appStyles.input}
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
            secureTextEntry={true}
            placeholder="Confirm Password"
            autoCapitalize={"none"}
          />
          <PrimaryButton
            loading={loading}
            disabled={loading}
            title="Next"
            handleOnPress={handleSignUp}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText]}>Already a user?</Text>
          <Pressable onPress={() => navigation.navigate("SignIn")}>
            <Text style={{ fontSize: 17, color: "lightblue" }}> Login</Text>
          </Pressable>
        </View>
      </KeyboardAvoidView>
    </LinearBackground>

  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    marginHorizontal: "10%",
    marginTop: "5%"
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