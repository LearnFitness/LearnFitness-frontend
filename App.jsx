import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import auth from '@react-native-firebase/auth';

import WelcomeScreen from "./screens/WelcomeScreen";
import SignInScreen from "./screens/auth/SignInScreen";
import SignUpScreen from "./screens/auth/SignUpScreen";
import ResetPasswordScreen from "./screens/auth/ResetPasswordScreen";
import HomeNavigator from "./screens/HomeNavigator";

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
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ?
          <Stack.Screen name="HomeNavigator" component={HomeNavigator} options={{ headerShown: false }} /> :
          <>
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
          </>
        }
      </Stack.Navigator>
    </NavigationContainer>
  )
}