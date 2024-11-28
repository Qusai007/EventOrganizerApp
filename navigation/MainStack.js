import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for icons
import EventListScreen from "../screens/EventListScreen";
import FavoriteEventsScreen from "../screens/FavoriteEventsScreen";
import AddEditEventScreen from "../screens/AddEditEventScreen";
import { auth } from "../firebase";
import { Button } from "react-native";

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
          title: route.params?.eventId ? "Edit Event" : "Add Event",
        })}
      />
    </Stack.Navigator>
  );
}

export default function MainStack() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Events") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Favorites") {
            iconName = focused ? "heart" : "heart-outline";
          }

          // Return the Ionicons component
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Events" component={EventStack} />
      <Tab.Screen name="Favorites" component={FavoriteEventsScreen} />
    </Tab.Navigator>
  );
}
