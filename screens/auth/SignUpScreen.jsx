import React, { useState } from "react";
import { Alert, StyleSheet, Text, View, Pressable, Platform } from "react-native";
import { Input } from "@rneui/themed";
import auth from "@react-native-firebase/auth";
import LinearBackground from "../../components/LinearBackground";
import KeyboardAvoidView from "../../components/KeyboardAvoidView";
import PrimaryButton from "../../components/PrimaryButton"
import { appStyles } from "../../utils/styles";
import BackButton from "../../components/BackButton";
import { useHeaderHeight } from '@react-navigation/elements';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isPasswordShort, setIsPasswordShort] = useState(false);

  async function handleSignUp() {
    // Check if everything is empty
    if (!email.trim() && !password.trim() && !confirmPassword.trim()) {
      setEmailError(true);
      setPasswordError(true);
      return;
    }

    // Check if email is empty
    if (!email.trim()) {
      setEmailError(true);
      return;
    }

    // Check if password/confirm password is empty
    if (!password.trim() || !confirmPassword.trim()) {
      setPasswordError(true);
      return;
    }

    // Check password requirements
    if (password.length < 6) {
      setPasswordError(true);
      setIsPasswordShort(true);
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('The passwords do not match.');
      setPasswordError(true);
      return;
    }

    setLoading(true);
    try {
      await auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        Alert.alert('Please enter a valid email address.');
        setEmailError(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearBackground>
      <View style={styles.backButtonContainer}>
        <BackButton handleOnPress={() => navigation.goBack()} />
      </View>
      <KeyboardAvoidView
        containerStyle={styles.container}
        keyboardVerticalOffset={useHeaderHeight}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={{ marginTop: "30%" }}>
          <Text style={[appStyles.heading1, { color: "white", marginBottom: "20%"}]}>Create a LearnFitness account</Text>
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
            rightIcon={visiblePassword ?
              { type: "font-awesome", name: "eye", onPress: () => setVisiblePassword(false) } :
              { type: "font-awesome", name: "eye-slash", onPress: () => setVisiblePassword(true) }
            }
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError(false);
              setIsPasswordShort(text.length < 6);
            }}
            value={password}
            secureTextEntry={!visiblePassword}
            placeholder="Password"
            autoCapitalize={"none"}
            autoCorrect={false}
            spellCheck={false}
          />
          <Input
            inputContainerStyle={[appStyles.input, passwordError && styles.errorInput]}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setPasswordError(false);
            }}
            value={confirmPassword}
            secureTextEntry={!visiblePassword}
            placeholder="Confirm Password"
            autoCapitalize={"none"}
            autoCorrect={false}
            spellCheck={false}
          />
          <Text style={[styles.passwordRequirementText, isPasswordShort && styles.redText]}>
            * Password must be at least 6 characters.
          </Text>
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
    justifyContent: "center",
    marginBottom: 20
  },
  footerText: {
    color: "lightgrey",
    fontSize: 17
  },
  backButtonContainer: {
    position: 'relative',
    top: 50,
    left: 30,
    zIndex: 1,
  },
  errorInput: {
    borderColor: "red",
    borderWidth: 1.5,
  },
  passwordRequirementText: {
    color: "lightgrey",
    fontSize: 15,
    textAlign: 'left',
    marginBottom: 30,
    bottom: 10,
    marginLeft: 15
  },
  redText: {
    color: "red",
  },
})
