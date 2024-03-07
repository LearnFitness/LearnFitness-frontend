import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import FontAwesome from "@expo/vector-icons/FontAwesome6";

import DashboardScreen from "./DashboardScreen";
import WorkoutScreen from "./WorkoutScreen";
import ExerciseScreen from "./ExerciseScreen";
import ProgressScreen from "./ProgressScreen";
import SettingScreen from "./SettingScreen";

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

          // You can return any component that you like here!
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'teal',
        tabBarInactiveTintColor: 'gray', })
    }>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Workouts" component={WorkoutScreen} />
      <Tab.Screen name="Exercises" component={ExerciseScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Settings" component={SettingScreen} />
    </Tab.Navigator>
  )
}