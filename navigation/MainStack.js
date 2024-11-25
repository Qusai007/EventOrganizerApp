import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import EventListScreen from '../screens/EventListScreen';
import FavoriteEventsScreen from '../screens/FavoriteEventsScreen';
import AddEditEventScreen from '../screens/AddEditEventScreen';
import { Button } from 'react-native';
import { auth } from '../firebase';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function EventStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="EventList"
        component={EventListScreen}
        options={{
          headerRight: () => (
            <Button title="Logout" onPress={() => auth.signOut()} />
          ),
        }}
      />
      <Stack.Screen
        name="AddEditEvent"
        component={AddEditEventScreen}
        options={({ route }) => ({
          title: route.params?.eventId ? 'Edit Event' : 'Add Event',
        })}
      />
    </Stack.Navigator>
  );
}

export default function MainStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Events" component={EventStack} />
      <Tab.Screen name="Favorites" component={FavoriteEventsScreen} />
    </Tab.Navigator>
  );
}
