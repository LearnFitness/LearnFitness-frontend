import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpContextProvider from "../context/OnboardContext";

import Onboard1Screen from "../screens/Onboard1Screen";
import Onboard2Screen from "../screens/Onboard2Screen";

const Stack = createNativeStackNavigator();

export default function OnboardNavigator() {
  return (
    <SignUpContextProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboard1" component={Onboard1Screen} />
        <Stack.Screen name="Onboard2" component={Onboard2Screen} />
      </Stack.Navigator>
    </SignUpContextProvider>
  )
}