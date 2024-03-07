import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View, Pressable } from "react-native"
import { Button } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import AvatarPicker from "../../components/AvatarPicker";
import auth from "@react-native-firebase/auth";

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);

    if (confirmPassword !== password) {
      Alert.alert("Passwords do not match. Please try again");
      setLoading(false);
      return;
    }

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        console.log(userCredentials);
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          Alert.alert('That email address is invalid!');
        }

        Alert.alert(error);
      });
      // TODO: may need more handling after signing up??
    // if (!session) {
    //   Alert.alert("Please check your inbox for email verification!");
    //   navigation.navigate("SignInScreen");
    // }
    setLoading(false);
  }

  return (
    <LinearGradient colors={['#002f51', '#00604f']} style={styles.gradient}>
      <View style={styles.container}>

        <Text style={[styles.title]}>Create an Account</Text>

        <AvatarPicker />

        <View style={{ paddingHorizontal: 40 }}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setName(text)}
            value={name}
            placeholder="Your Name"
            autoCapitalize={"none"}
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="Email"
            autoCapitalize={"none"}
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setPassword(text)}
            value={password}
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
            buttonStyle={styles.signUpButton}
            loading={loading}
            disabled={loading}
            disabledStyle={{ backgroundColor: "gray" }}
            title="Create Account"
            onPress={() => signUpWithEmail()}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText]}>Already a user?</Text>
          <Pressable onPress={() => navigation.navigate("SignInScreen")}>
            <Text style={{ fontSize: 17, color: "lightblue" }}> Login</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 35
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