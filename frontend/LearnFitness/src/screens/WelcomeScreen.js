import React, { useState } from "react";
import {
  StyleSheet,
  ImageBackground,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import bgImg from "../assets/bg2.jpg";

import { auth } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
GoogleSignin.configure();

export default function WelcomeScreen() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  // Handle clicking on Sign Up button
  function handleSignupClick() {
    console.log(email);
    console.log(password);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(userCredential.user.uid);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        // ..
      });
  }

  // Somewhere in your code
  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setState({ userInfo });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.container}
        source={bgImg}
        resizeMode="cover"
      >
        <Text style={styles.text}>LearnFitness</Text>
        <Text style={styles.text}>A fitness app for everyone</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          value={password}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handleSignupClick}>
          <Text>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleGoogleSigninRedirect}
        >
          <Text>Google Signin</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    flex: 1,
    justifyContent: "center",
  },

  text: {
    color: "#fff",
    fontSize: 50,
  },

  input: {
    color: "#fff",
    fontSize: 20,

    margin: 5,
    padding: 5,
    height: 30,
    borderWidth: 1,
    borderColor: "#fff",
  },

  button: {
    color: "black",
    height: 50,
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
});
