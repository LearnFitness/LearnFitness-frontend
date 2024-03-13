import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "@expo/vector-icons/FontAwesome6";

import DashboardScreen from "../screens/home/DashboardScreen";
import WorkoutsScreen from "../screens/home/WorkoutsScreen";
import ExercisesScreen from "../screens/home/ExercisesScreen";
import ProgressScreen from "../screens/home/ProgressScreen";
import SettingsScreen from "../screens/home/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function HomeNavigator() {
  return (
    <Tab.Navigator screenOptions={
      ({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') iconName = "house"
          else if (route.name === 'Workouts') iconName = "rectangle-list"
          else if (route.name === 'Exercises') iconName = "dumbbell"
          else if (route.name === 'Progress') iconName = "chart-simple"
          else if (route.name === 'Settings') iconName = "gear"

          // Return the icon for the tabs
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'teal',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })
    }>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Workouts" component={WorkoutsScreen} />
      <Tab.Screen name="Exercises" component={ExercisesScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  )
}