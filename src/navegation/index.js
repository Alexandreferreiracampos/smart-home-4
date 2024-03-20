import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../screens/home';


const Stack = createNativeStackNavigator();

export default function Navigation(){
    return(
        <NavigationContainer>
           <Stack.Navigator 
            initialRouteName='Login' 
            screenOptions={{
              headerShown: false,
              cardStyle: {
                opacity: ({ current }) => current.progress, // Ajuste conforme necessário
              },
            }}
           >
             <Stack.Screen name="Home" component={Home}/>
           </Stack.Navigator>
        </NavigationContainer>
    )
}