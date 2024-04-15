import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { Alert, Pressable, View, Text } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome6";

function GoogleButton({ handlePress }) {
  return (
    <Pressable style={{ width: 300, height: 40, borderRadius: 50, backgroundColor: "#a03e3e", flexDirection: "row", justifyContent: "center", alignItems: "center"}} onPress={handlePress}>
      <FontAwesome name="google" color="white"/>
      <Text style={{color: "white", marginLeft: 5, fontSize: 15, fontWeight: "500"}}>Sign in with Google</Text>
    </Pressable>
  )
}

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
      const user = await GoogleSignin.signIn();
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(user.idToken);
      await auth().signInWithCredential(googleCredential);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // Bypass this error for better UX
      } else {
        Alert.alert(error.message);
      }
    }
  }

  return (
    <View style={{marginBottom: 15}}>
      <GoogleButton
        handlePress={() => signInWithGoogle()}
      />
    </View>
  )
}
