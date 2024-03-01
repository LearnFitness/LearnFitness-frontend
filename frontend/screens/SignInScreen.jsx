import React, { useState } from "react";
import { Alert, StyleSheet, View, Text, TextInput, Pressable, SafeAreaView } from "react-native";
import { supabase } from "../utils/supabase";
import { Button } from '@rneui/themed';
import GoogleSignIn from "../components/GoogleSignIn";
import { LinearGradient } from 'expo-linear-gradient';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <LinearGradient colors={['#002f51', '#00604f']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>

        <Text style={[styles.title]}>Login to your account</Text>

        <View style={{ paddingHorizontal: 40 }}>
          <TextInput
            style={styles.input}
            leftIcon={{ type: "font-awesome", name: "envelope" }}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize={"none"}
          />
          <TextInput
            style={styles.input}

            leftIcon={{ type: "font-awesome", name: "lock" }}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="password"
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
            onPress={() => navigation.navigate("ResetPasswordScreen")}>
            <Text style={{textAlign: "center", marginTop: 20, fontSize: 17, color: "darkgrey"}}>Forgot password?</Text>
          </Pressable>
        </View>



        <View style={styles.googleSignInContainer}>
          <Text style={{ color: "white", marginVertical: 10, fontSize: 17 }}>or continue with</Text>
          <GoogleSignIn />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText]}>Don't have an account?</Text>
          <Pressable onPress={() => navigation.navigate("SignUpScreen")}>
            <Text style={{fontSize: 17, color: "white"}}> Sign Up</Text>
          </Pressable>
        </View>
      </SafeAreaView>

    </LinearGradient>

  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-between"
  },
  title: {
    fontWeight: "500",
    textAlign: "center",
    marginTop: 200,
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
    borderRadius: 10
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
    color: "black",
    fontSize: 17
  }
});
