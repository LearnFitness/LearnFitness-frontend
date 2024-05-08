import { useState, useRef, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import auth from '@react-native-firebase/auth';
import { RootSiblingParent } from "react-native-root-siblings";
import { Platform } from "react-native";


import WelcomeScreen from "./screens/WelcomeScreen";
import SignInScreen from "./screens/auth/SignInScreen";
import ResetPasswordScreen from "./screens/auth/ResetPasswordScreen";
import HomeNavigator from "./navigators/HomeNavigator";
import OnboardNavigator from "./navigators/OnboardNavigator";
import SignUpScreen from "./screens/auth/SignUpScreen";
import AddWorkoutScreen from "./screens/AddWorkoutScreen";
import SettingsScreen from "./screens/home/SettingsScreen";
import * as Notifications from "expo-notifications";
import AddExerciseScreen from "./screens/AddExerciseScreen";
import ExerciseModal from "./components/ExerciseModal";
import ExercisesSearchModal from "./components/ExercisesSearchModal";
import StartWorkoutScreen from "./screens/StartWorkoutScreen";
import SessionModal from "./screens/SessionModal";
import Constants from "expo-constants";
import WorkoutImagePicker from "./components/WorkoutImagePicker";

const Stack = createNativeStackNavigator(); 

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const navigationRef = useRef();

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
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{ "headerShown": false }}>
          {user ?
            <>
              <Stack.Screen name="OnboardNavigator" component={OnboardNavigator} />
              <Stack.Screen name="HomeNavigator" component={HomeNavigator} options={{ animation: "none", gestureEnabled: false }} />
              <Stack.Screen
                name="StartWorkoutScreen"
                component={StartWorkoutScreen}
                options={({ route }) => ({
                  title: route.params.headerTitle,
                  gestureEnabled: false,
                  headerBackVisible: false,
                  headerShown: true,
                  headerTransparent: Platform.OS === "ios" ? true : false,
                  headerBlurEffect: "dark",
                  headerTitleStyle: { color: "white", fontSize: 18 },
                  headerStyle: Platform.OS === "ios" ? null : { backgroundColor: "#002328" },
                  headerTitleAlign: "center",
                  autoHideHomeIndicator: true,
                })} />
              <Stack.Screen
                name="AddWorkoutScreen"
                component={AddWorkoutScreen}
                options={({ route }) => ({
                  title: route.params.headerTitle,
                  gestureEnabled: false,
                  headerBackVisible: false,
                  headerShown: true,
                  headerTransparent: Platform.OS === "ios" ? true : false,
                  headerBlurEffect: "dark",
                  headerTitleStyle: { color: "white", fontSize: 18 },
                  headerStyle: Platform.OS === "ios" ? null : { backgroundColor: "#002328" },
                  headerTitleAlign: "center",
                  autoHideHomeIndicator: true,
                })} />
              <Stack.Group screenOptions={{ presentation: "modal" }}>
                <Stack.Screen name="AddExerciseScreen" component={AddExerciseScreen} />
                <Stack.Screen name="ExercisesSearchModal" component={ExercisesSearchModal} />
                <Stack.Screen name="ExerciseModal" component={ExerciseModal} />
                <Stack.Screen name="SessionModal" component={SessionModal} />
                <Stack.Screen name="WorkoutImagePicker" component={WorkoutImagePicker} />
              </Stack.Group>
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