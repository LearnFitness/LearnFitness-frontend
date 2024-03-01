import { GoogleSignin, GoogleSigninButton, GoogleSigninButtonProps, statusCodes } from "@react-native-google-signin/google-signin";
import { supabase } from '../utils/supabase';
import { View } from "react-native";

export default function GoogleSignIn() {
  GoogleSignin.configure({
    // From Google Cloud's console
    webClientId:
      "611505217549-0d0f0gacdvkgd6i77mma9q7e46u9i0c2.apps.googleusercontent.com",
    iosClientId:
      "611505217549-e4dc3rks52mml21jat2tm5mp781qtr8j.apps.googleusercontent.com",
  });

  async function SignInWithGoogle() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.idToken) {
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
  }

  return (
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Icon}
        color={GoogleSigninButton.Color.Light}
        onPress={() => SignInWithGoogle()}
      />
  )
}
