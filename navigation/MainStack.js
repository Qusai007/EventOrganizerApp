import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import EventListScreen from "../screens/EventListScreen";
import AddEditEventScreen from "../screens/AddEditEventScreen";
import FavoriteEventsScreen from "../screens/FavoriteEventsScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function EventStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="EventList" component={EventListScreen} />
      <Stack.Screen name="AddEditEvent" component={AddEditEventScreen} />
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
