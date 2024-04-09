import React, { useState } from "react";
import { Alert, StyleSheet, Text, View, Pressable } from "react-native";
import { Input } from "@rneui/themed";
import auth from "@react-native-firebase/auth";
import LinearBackground from "../../components/LinearBackground";
import KeyboardAvoidView from "../../components/KeyboardAvoidView";
import PrimaryButton from "../../components/PrimaryButton"
import { appStyles } from "../../utils/styles";

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState();
  const [loading, setLoading] = useState(false);

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
          <Input
            inputContainerStyle={appStyles.input}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="Email"
            autoCapitalize={"none"}
            autoCorrect={false}
            spellCheck={false}
          />
          <Input
            inputContainerStyle={appStyles.input}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={"none"}
            autoCorrect={false}
            spellCheck={false}
          />
          <Input
            inputContainerStyle={appStyles.input}
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
            secureTextEntry={true}
            placeholder="Confirm Password"
            autoCapitalize={"none"}
            autoCorrect={false}
            spellCheck={false}
          />
          <PrimaryButton
            loading={loading}
            disabled={loading}
            title="Next"
            handleOnPress={() => handleSignUp()}
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
    color: "lightgrey",
    fontSize: 17
  }
})