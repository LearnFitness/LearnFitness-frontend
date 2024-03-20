import { useState, useEffect, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import auth from '@react-native-firebase/auth';

import WelcomeScreen from "./screens/WelcomeScreen";
import SignInScreen from "./screens/auth/SignInScreen";
import ResetPasswordScreen from "./screens/auth/ResetPasswordScreen";
import HomeNavigator from "./navigators/HomeNavigator";
import OnboardNavigator from "./navigators/OnboardNavigator";
import SignUpScreen from "./screens/auth/SignUpScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const unsubscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return unsubscriber; // unsubscribe on unmount
  }, []);
  
  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ "headerShown": false }}>
        {user ?
          <>
            <Stack.Screen name="OnboardNavigator" component={OnboardNavigator} />
            <Stack.Screen name="HomeNavigator" component={HomeNavigator} options={{ animation: "none" }}/>
          </>
          :
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          </>
        }
      </Stack.Navigator>
    </NavigationContainer>
  )
}