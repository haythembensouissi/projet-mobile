import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, ActivityIndicator, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { firebase } from "../../firebase/db";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [userData, setUser] = useState({
    email: '',
    username: '',
    role: '',
    id: '',
  });
  const [loading, setLoading] = useState(true); // Loading state

  const getUser = () => {
    const usersRef = firebase.firestore().collection("users");
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        await usersRef.doc(user.uid).get().then((document) => {
          if (document.exists) {
            const data = document.data() || {};
            setUser({
              id: document.id,
              email: data.email || '',
              username: data.username || '',
              role: data.role || '',
            });
          } else {
            console.warn('No user document found.');
          }
        }).catch((error) => {
          console.error("Error fetching user data:", error);
        }).finally(() => {
          setLoading(false); // Set loading to false after fetching data
        });
      } else {
        setLoading(false); // Handle case where user is not authenticated
      }
    });
  };

  useEffect(() => {
    getUser();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="addbook"
        options={{
          href: userData.role === "admin" ? "/addbook" : null,
          title: 'Add Book',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="book.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
