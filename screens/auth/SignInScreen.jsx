import React, { useState } from "react";
import { Alert, StyleSheet, View, Text, Pressable } from "react-native";
import { Input } from "@rneui/themed";
import GoogleSignIn from "../../components/GoogleSignIn";
import auth from '@react-native-firebase/auth';
import LinearBackground from "../../components/LinearBackground";
import PrimaryButton from "../../components/PrimaryButton";
import { appStyles } from "../../utils/styles";
import AppleSignIn from "../../components/AppleSignIn";
import { Platform } from "react-native";

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  async function signInWithEmail() {
    // Check if email is empty
    if (!email.trim()) {
      setEmailError(true);
      return;
    }

    // Check if password is empty
    if (!password.trim()) {
      setPasswordError(true);
      return;
    }

    setLoading(true);

    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      if (error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        Alert.alert('Invalid login credentials.');
      } else {
        Alert.alert("An error occured.", error.code);
      }
    }
    setLoading(false);
  }

  return (
    <LinearBackground containerStyle={styles.container}>

      <Text style={[styles.title]}>Login to your account</Text>

      <View>
        <Input
          inputContainerStyle={[appStyles.input, emailError && styles.errorInput]}
          leftIcon={{ type: "font-awesome", name: "envelope", size: 20 }}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError(false);
          }}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
          autoCorrect={false}
          spellCheck={false}
        />
        <Input
          inputContainerStyle={[appStyles.input, passwordError && styles.errorInput]}
          leftIcon={{ type: "font-awesome", name: "lock" }}
          rightIcon={visiblePassword ?
            { type: "font-awesome", name: "eye", onPress: () => setVisiblePassword(false) } :
            { type: "font-awesome", name: "eye-slash", onPress: () => setVisiblePassword(true) }
          }
          onChangeText={(text) => {
            setPassword(text);
            setPasswordError(false);
          }}
          value={password}
          secureTextEntry={!visiblePassword}
          placeholder="Password"
          autoCapitalize={"none"}
          autoCorrect={false}
          spellCheck={false}
        />
        <PrimaryButton
          loading={loading}
          disabled={loading}
          title="Sign In"
          titleStyle={{fontWeight: "600"}}
          handleOnPress={signInWithEmail}
        />
        <Pressable
          onPress={() => navigation.navigate("ResetPassword")}>
          <Text style={{ textAlign: "center", marginTop: 20, fontSize: 17, color: "lightblue" }}>Forgot password?</Text>
        </Pressable>
      </View>

      <View style={styles.thirdPartySignInContainer}>
        <Text style={styles.thirdPartySignInText}>or</Text>
        <GoogleSignIn />
        {Platform.OS === "ios" ? <AppleSignIn /> : null}
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText]}>Don't have an account?</Text>
        <Pressable onPress={() => navigation.navigate("SignUp")}>
          <Text style={{ fontSize: 17, color: "lightblue" }}> Sign Up</Text>
        </Pressable>
      </View>
    </LinearBackground>

  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    marginHorizontal: "10%"
  },
  title: {
    fontWeight: "500",
    textAlign: "center",
    marginTop: "30%",
    fontSize: 40,
    color: "white"
  },
  thirdPartySignInContainer: {
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "grey",
  },
  thirdPartySignInText: {
    paddingHorizontal: 25,
    paddingVertical: 5,
    color: "white",
    marginVertical: 10,
    fontSize: 15,
    position: "relative",
    bottom: 26,
    backgroundColor: "teal",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20
  },
  footerText: {
    color: "lightgrey",
    fontSize: 17
  },
  errorInput: {
    borderColor: "red",
    borderWidth: 1.5,
  }
});
