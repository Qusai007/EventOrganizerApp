import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from 'react-native';
import { auth } from '../firebase';
import EventListScreen from '../screens/EventListScreen';
import FavoriteEventsScreen from '../screens/FavoriteEventsScreen';

const Tab = createBottomTabNavigator();

export default function MainStack({ navigation }) {
  const handleLogout = async () => {
    try {
      await auth.signOut(); // Signs out the user
      navigation.replace('Auth'); // Navigates to the login screen
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="EventList"
        component={EventListScreen}
        options={{
          title: 'Events',
          headerRight: () => (
            <Button title="Logout" onPress={handleLogout} />
          ),
        }}
      />
      <Tab.Screen
        name="FavoriteEvents"
        component={FavoriteEventsScreen}
        options={{
          title: 'Favorites',
          headerRight: () => (
            <Button title="Logout" onPress={handleLogout} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
