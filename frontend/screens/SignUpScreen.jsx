import { View } from "react-native"
import { supabase } from "../utils/supabase";

export default function SignUpScreen() {
  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }
  
  return (
    <View>

    </View>
  )
}