import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FontAwesome from "@expo/vector-icons/FontAwesome6";

import DashboardScreen from "../screens/home/DashboardScreen";
import WorkoutsScreen from "../screens/home/WorkoutsScreen";
import ExercisesScreen from "../screens/home/ExercisesScreen";
import SettingsScreen from "../screens/home/SettingsScreen";
import HistoryScreen from "../screens/home/HistoryScreen";
import ChartsScreen from "../screens/home/ChartsScreen";

const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

function ProgressScreen() {
  return (
    <TopTab.Navigator initialRouteName="Charts">
      <TopTab.Screen name="Charts" component={ChartsScreen} />
      <TopTab.Screen name="History" component={HistoryScreen} />
    </TopTab.Navigator>
  )
}

export default function HomeNavigator() {
  return (
    <BottomTab.Navigator screenOptions={
      ({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Dashboard") iconName = "house";
          else if (route.name === "Workouts") iconName = "list";
          else if (route.name === "Exercises") iconName = "dumbbell";
          else if (route.name === "Progress") iconName = "chart-simple";
          else if (route.name === "Settings") iconName = "gear";

          // Return the icon for the tabs
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "teal",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })
    }>
      <BottomTab.Screen name="Dashboard" component={DashboardScreen} />
      <BottomTab.Screen name="Workouts" component={WorkoutsScreen} />
      <BottomTab.Screen name="Exercises" component={ExercisesScreen} />
      <BottomTab.Screen name="Progress" component={ProgressScreen} options={{ headerShown: true }} />
      <BottomTab.Screen name="Settings" component={SettingsScreen} />
    </BottomTab.Navigator>
  )
}
