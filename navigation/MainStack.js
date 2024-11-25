import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EventListScreen from '../screens/EventListScreen';
import FavoriteEventsScreen from '../screens/FavoriteEventsScreen';
import AddEditEventScreen from '../screens/AddEditEventScreen'; 

const Stack = createStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="EventList" component={EventListScreen} />
      <Stack.Screen name="Favorites" component={FavoriteEventsScreen} />
      <Stack.Screen name="AddEditEvent" component={AddEditEventScreen} /> 
    </Stack.Navigator>
  );
}
