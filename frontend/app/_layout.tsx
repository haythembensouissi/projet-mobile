import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import firebase from 'firebase/compat/app';

import { useColorScheme } from '@/hooks/useColorScheme';
import { View } from 'react-native';
import Login from './Login';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [user, setUser] = useState<{ [key: string]: any } | null>(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is logged in
        setUser(user);
      } else {
        // User is logged out
        setUser(null);
      }
    });

    if (loaded) {
      SplashScreen.hideAsync();
    }

    return () => unsubscribe();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {user ? (
        // If user is logged in, show the main app screen
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      ) : (
        // If user is not logged in, show login screen
        <View style={{ flex: 1 }}>
          <Login />
        </View>
      )}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
