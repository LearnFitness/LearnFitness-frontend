import { createStackNavigator } from '@react-navigation/stack';
import AddCustomScreen from '../screens/home/AddCustomScreen'; // Make sure to import AddCustomScreen

const Stack = createStackNavigator();

const AppStackNavigator = () => {
  return (
    <Stack.Navigator>
      {/* Other screens */}
      <Stack.Screen name="AddCustomScreen" component={AddCustomScreen} />
    </Stack.Navigator>
  );
};

export default AppStackNavigator;
