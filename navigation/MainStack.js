import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EventListScreen from '../screens/EventListScreen';
import FavoriteEventsScreen from '../screens/FavoriteEventsScreen';
import { Button } from 'react-native';
import { auth } from '../firebase';

const Tab = createBottomTabNavigator();

export default function MainStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="EventList"
        component={EventListScreen}
        options={{
          title: 'Events',
          headerRight: () => (
            <Button title="Logout" onPress={() => auth.signOut()} />
          ),
        }}
      />
      <Tab.Screen
        name="FavoriteEvents"
        component={FavoriteEventsScreen}
        options={{
          title: 'Favorites',
          headerRight: () => (
            <Button title="Logout" onPress={() => auth.signOut()} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
