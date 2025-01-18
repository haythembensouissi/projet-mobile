import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {firebase} from "../../firebase/db"

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [userData,setUser]=useState({email:"",
  username:"",
  role:"",id:""
  })
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
        });
      }
    });
  };
  
  useEffect(() => {
  getUser()
   
  }, []);
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
        name="explore"
        options={{
          title: 'Add Book',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      
    </Tabs>
  );
}
