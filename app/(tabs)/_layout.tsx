import { FontAwesome } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true, // Show header to place the profile button
        tabBarStyle: {
            backgroundColor: colorScheme === 'dark' ? '#111827' : '#ffffff',
            borderTopColor: colorScheme === 'dark' ? '#374151' : '#e5e7eb',
        },
        headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#111827' : '#ffffff',
        },
        headerTintColor: Colors[colorScheme ?? 'light'].text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={28} color={color} />
          ),
          headerRight: () => (
            <Link href="/user" asChild>
              <TouchableOpacity className="mr-4">
                <FontAwesome 
                  name="user-circle" 
                  size={25} 
                  color={Colors[colorScheme ?? 'light'].text}
                />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="compass" size={28} color={color} />
          ),
           headerRight: () => (
            <Link href="/user" asChild>
              <TouchableOpacity className="mr-4">
                <FontAwesome 
                  name="user-circle" 
                  size={25} 
                  color={Colors[colorScheme ?? 'light'].text}
                />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
    </Tabs>
  );
}