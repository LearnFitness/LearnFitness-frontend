import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { StyleSheet, SafeAreaView, Text, Button } from "react-native";
import "react-native-url-polyfill/auto";
import { supabase } from "./utils/supabase";
import Auth from "./components/Auth";
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { LinearGradient } from "expo-linear-gradient";

export default function App() {
  GoogleSignin.configure({
    webClientId:
      "611505217549-0d0f0gacdvkgd6i77mma9q7e46u9i0c2.apps.googleusercontent.com",
    iosClientId:
      "611505217549-e4dc3rks52mml21jat2tm5mp781qtr8j.apps.googleusercontent.com",
  });

  const [session, setSession] = useState<Session | null>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <>
        {session && session.user ? (
          <>
            <Text style={styles.subTitle}>Hello {userName}!</Text>
            <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
          </>
        ) : (
          <SafeAreaView>
            <Text style={styles.title}>LearnFitness</Text>
            <Auth />
            <GoogleSigninButton
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={async () => {
                try {
                  await GoogleSignin.hasPlayServices();
                  const userInfo = await GoogleSignin.signIn();
                  if (userInfo.idToken) {
                    setUserName(userInfo.user.name);
                    const { data, error } =
                      await supabase.auth.signInWithIdToken({
                        provider: "google",
                        token: userInfo.idToken,
                      });
                    console.log(error, data);
                  } else {
                    throw new Error("no ID token present!");
                  }
                } catch (error) {
                  if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                    // user cancelled the login flow
                  } else if (error.code === statusCodes.IN_PROGRESS) {
                    // operation (e.g. sign in) is in progress already
                  } else if (
                    error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
                  ) {
                    // play services not available or outdated
                  } else {
                    // some other error happened
                  }
                }
              }}
            />
          </SafeAreaView>
        )}
      </>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 50,
    fontWeight: "bold",
  },
  subTitle: {
    textAlign: "center",
    fontSize: 20,
  },
});
