import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import auth from '@react-native-firebase/auth';
import { RootSiblingParent } from "react-native-root-siblings";

import WelcomeScreen from "./screens/WelcomeScreen";
import SignInScreen from "./screens/auth/SignInScreen";
import ResetPasswordScreen from "./screens/auth/ResetPasswordScreen";
import HomeNavigator from "./navigators/HomeNavigator";
import OnboardNavigator from "./navigators/OnboardNavigator";
import SignUpScreen from "./screens/auth/SignUpScreen";
import AddWorkoutScreen from "./screens/AddWorkoutScreen";
import AddExerciseScreen from "./screens/AddExerciseScreen";
import ExerciseModal from "./components/ExerciseModal";
import ExercisesSearchModal from "./components/ExercisesSearchModal";

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
    <RootSiblingParent>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ "headerShown": false }}>
          {user ?
            <>
              <Stack.Screen name="OnboardNavigator" component={OnboardNavigator} />
              <Stack.Screen name="HomeNavigator" component={HomeNavigator} options={{ animation: "none" }} />
              <Stack.Screen name="AddWorkoutScreen" component={AddWorkoutScreen} options={({ route }) => ({ title: route.params.headerTitle, headerShown: true, headerBackTitle: "Workouts" })} />
              <Stack.Screen name="AddExerciseScreen" component={AddExerciseScreen} options={{ presentation: "modal" }} />
              <Stack.Screen name="ExercisesSearchModal" component={ExercisesSearchModal} options={{ presentation: "modal" }} />
              <Stack.Screen name="ExerciseModal" component={ExerciseModal} options={{ presentation: "modal" }} />
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
    </RootSiblingParent>
  )
}