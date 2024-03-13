import React, { useState } from "react";
import { Alert, StyleSheet, View, Text, Pressable } from "react-native";
import { Button, Input } from '@rneui/themed';
import GoogleSignIn from "../../components/GoogleSignIn";
import auth from '@react-native-firebase/auth';
import LinearBackground from "../../components/LinearBackground";

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);

    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        Alert.alert('That email address is invalid!');
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        Alert.alert("Invalid login credentials");
      } else {
        Alert.alert("An error occured", error.code);
      }
    }
    setLoading(false);
  }

  return (
    <LinearBackground style={styles.container}>

      <Text style={[styles.title]}>Login to your account</Text>

      <View style={{ paddingHorizontal: 40 }}>
        <Input
          containerStyle={styles.input}
          leftIcon={{ type: "font-awesome", name: "envelope", size: 20 }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
        <Input
          containerStyle={styles.input}
          leftIcon={{ type: "font-awesome", name: "lock" }}
          rightIcon={visiblePassword ?
            { type: "font-awesome", name: "eye", onPress: () => setVisiblePassword(false) } :
            { type: "font-awesome", name: "eye-slash", onPress: () => setVisiblePassword(true) }
          }
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={!visiblePassword}
          placeholder="Password"
          autoCapitalize={"none"}
        />
        <Button
          buttonStyle={styles.signInButton}
          loading={loading}
          disabled={loading}
          disabledStyle={{ backgroundColor: "gray" }}
          title="Sign In"
          onPress={() => signInWithEmail()}
        />
        <Pressable
          onPress={() => navigation.navigate("ResetPassword")}>
          <Text style={{ textAlign: "center", marginTop: 20, fontSize: 17, color: "lightblue" }}>Forgot password?</Text>
        </Pressable>
      </View>

      <View style={styles.googleSignInContainer}>
        <Text style={{ paddingHorizontal: 25, paddingVertical: 5, color: "white", marginVertical: 10, fontSize: 17, position: "relative", bottom: 26, backgroundColor: "teal" }}>or continue with</Text>
        <GoogleSignIn />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText]}>Don't have an account?</Text>
        <Pressable onPress={() => navigation.navigate("SignUpNavigator")}>
          <Text style={{ fontSize: 17, color: "lightblue" }}> Sign Up</Text>
        </Pressable>
      </View>
    </LinearBackground>

  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "500",
    textAlign: "center",
    marginTop: 150,
    marginBottom: 20,
    marginHorizontal: 40,
    fontSize: 40,
    color: "white"
  },
  flex1: {
    flex: 1
  },
  signInButton: {
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
    borderRadius: 10,
  },
  googleSignInContainer: {
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "grey",
    marginHorizontal: 40
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
});
