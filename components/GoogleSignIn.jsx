import { GoogleSignin, GoogleSigninButton, statusCodes } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { useContext } from "react";
import { OnboardContext } from "../context/OnboardContext";
import { Alert } from "react-native";

export default function GoogleSignIn({ navigation }) {
  // const { signUpData, updateMultipleSignUpData } = useContext(SignUpContext);

  GoogleSignin.configure({
    // From Google Cloud's console
    webClientId:
      "611505217549-0d0f0gacdvkgd6i77mma9q7e46u9i0c2.apps.googleusercontent.com",
    iosClientId:
      "611505217549-e4dc3rks52mml21jat2tm5mp781qtr8j.apps.googleusercontent.com",
  });

  async function signInWithGoogle() {
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(user.idToken);

      // Get user info from Google
      // updateMultipleSignUpData({
      //   externalCredential: googleCredential,
      //   name: user.user.displayName,
      //   email: user.user.email,
      //   photoURL: user.user.photo
      // })

      const userCredential = await auth().signInWithCredential(googleCredential);
      // if (userCredential.additionalUserInfo.isNewUser)
      //   // Navigate to additional Sign Up screens
      //   navigation.navigate("SignUp2");

    } catch (error) {
      Alert.alert(error.message);
    }
  }

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Icon}
      color={GoogleSigninButton.Color.Light}
      onPress={() => signInWithGoogle()}
    />
  )
}
