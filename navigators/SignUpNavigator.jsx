import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpContextProvider from "../context/SignUpContext";

import SignUp1Screen from "../screens/auth/SignUp1Screen";
import SignUp2Screen from "../screens/auth/SignUp2Screen";
import SignUp3Screen from "../screens/auth/SignUp3Screen";

const Stack = createNativeStackNavigator();

export default function SignUpNavigator() {
  return (
    <SignUpContextProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignUp1" component={SignUp1Screen} />
        <Stack.Screen name="SignUp2" component={SignUp2Screen} />
        <Stack.Screen name="SignUp3" component={SignUp3Screen} />
      </Stack.Navigator>
    </SignUpContextProvider>
  )
}