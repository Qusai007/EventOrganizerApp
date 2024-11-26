import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import EventListScreen from "./screens/EventListScreen";
import FavoriteEventsScreen from "./screens/FavoriteEventsScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#1c1c1e",
    primary: "#FFD700", // Gold accent
    text: "#FFFFFF", // White text
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: "#333" },
        tabBarActiveTintColor: "#FFD700",
        tabBarInactiveTintColor: "#aaa",
        headerStyle: { backgroundColor: "#333" },
        headerTintColor: "#FFD700",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Events") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Favorites") {
            iconName = focused ? "heart" : "heart-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Events" component={EventListScreen} />
      <Tab.Screen name="Favorites" component={FavoriteEventsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer theme={AppTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
