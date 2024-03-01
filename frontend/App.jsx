import { useState, useEffect } from "react";
import { supabase } from "./utils/supabase";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "./screens/WelcomeScreen";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import HomeNavigator from "./screens/HomeNavigator";

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {session && session.user ?
          <Stack.Screen name="HomeNavigator" component={HomeNavigator} options={{ headerShown: false }} /> :
          <>
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{  }}/>
            <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
          </>
        }
      </Stack.Navigator>
    </NavigationContainer>
  )
}