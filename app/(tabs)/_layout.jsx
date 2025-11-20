import React from "react";

import { Tabs } from "expo-router";
import { Home, User, Settings, SquarePen, MessageCircleMore, TriangleAlert } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="attendance"
        options={{
          title: "Attendance",
          tabBarIcon: ({ color, size }) => (
            <SquarePen color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="performance"
        options={{
          title: "Performance Analysis",
          tabBarIcon: ({ color, size }) => (
            <SquarePen color={color} size={size} />
          ),
        }}
      />


      <Tabs.Screen
        name="intervention"
        options={{
          title: "Intervention",
          tabBarIcon: ({ color, size }) => <MessageCircleMore color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="subject"
        options={{
          title: "Subjects at Risk",
          tabBarIcon: ({ color, size }) => (
            <TriangleAlert color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}


