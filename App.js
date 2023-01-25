import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//components
import Home from "./components/Home";
import Single from "./components/Single";
import Create from "./components/Create";

//set the navigation
const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen 
        name='Home'
        component={Home}
        />
        <Stack.Screen 
        name='Single'
        component={Single}
         />
        <Stack.Screen 
        name='Create' 
        component={Create} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
