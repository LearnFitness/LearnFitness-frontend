import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Alert, View, Text, TextInput, StyleSheet } from "react-native";
import { Input, Button } from '@rneui/themed';
import auth from "@react-native-firebase/auth";

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [requestSent, setRequestSent] = useState(false)
  const [loading, setLoading] = useState(false);

  async function handleResetPassword() {
    setLoading(true);
    try {
      await auth().sendPasswordResetEmail(email);
      setRequestSent(true);
    } catch (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  }

  return (
    <LinearGradient colors={['#002f51', '#00604f']} style={styles.gradient}>
      {requestSent ? (
        <View styles={styles.container}>
          <Text style={styles.title}>Request sent</Text>
          <Text style={styles.subTitle}>Check your inbox to continue. It might take a few minutes for the email to arrive.</Text>
        </View>
      ) : (
        <View style={styles.container} >
          <View>
            <Text style={styles.title}>Forgot your password?</Text>
            <Text style={styles.subTitle}>No worries, let's get you signed back in.</Text>
          </View>

          <View>
            <Input
              containerStyle={styles.input}
              leftIcon={{ type: "font-awesome", name: "envelope", size: 20 }}
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholder="Enter your email to continue"
              autoCapitalize={"none"}
            />
            <Button
              buttonStyle={styles.sendButton}
              loading={loading}
              disabled={loading || email === ""}
              disabledStyle={{ backgroundColor: "gray" }}
              title="Send"
              onPress={() => handleResetPassword()}
            />
          </View>
        </View >
      )
      }
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 35,
    paddingHorizontal: 40
  },
  title: {
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 34,
    color: "white"
  },
  subTitle: {
    fontWeight: "300",
    textAlign: "center",
    marginBottom: 50,
    fontSize: 20,
    color: "white"
  },
  input: {
    fontSize: 17,
    height: 50,
    backgroundColor: "white",
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  sendButton: {
    backgroundColor: "#0494e8",
    height: 50,
    borderRadius: 30
  },
})