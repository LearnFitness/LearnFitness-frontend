import { useState } from "react";
import { Alert, View, Text, StyleSheet } from "react-native";
import { Input, Button } from '@rneui/themed';
import auth from "@react-native-firebase/auth";
import LinearBackground from "../../components/LinearBackground";
import PrimaryButton from "../../components/PrimaryButton";
import BackButton from "../../components/BackButton";

export default function ResetPasswordScreen({ navigation }) {
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
    <LinearBackground>
      <BackButton handleOnPress={() => navigation.goBack()}/>
      {requestSent ?
        (
          <View style={styles.container}>
            <Text style={styles.title}>Request sent</Text>
            <Text style={styles.subTitle}>Check your inbox to continue. It might take a few minutes for the email to arrive.</Text>
          </View>
        ) : (
          <View style={styles.container}>
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
              <PrimaryButton
                title="Send"
                loading={loading}
                disabled={loading || !email}
                handleOnPress={handleResetPassword}
              />
            </View>
          </View >
        )
      }
    </LinearBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginHorizontal: "10%",
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
})