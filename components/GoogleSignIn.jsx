import { GoogleSignin, GoogleSigninButton, statusCodes } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";

export default function GoogleSignIn() {
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
      const { idToken } = await GoogleSignin.signIn();
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);

    } catch (error) {

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
