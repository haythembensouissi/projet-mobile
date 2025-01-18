import { Image, StyleSheet, Platform,View,Text,Button } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';

import { useRouter } from 'expo-router';
import Login from "../Login"
export default function HomeScreen() {
  const [user, setUser] = useState<{ [key: string]: any } | null>(null);
  const router = useRouter();
  const handleSignOut = () => {
    firebase.auth().signOut().then(() => {
      router.push('/');  // Redirect to login screen after sign out
    }).catch((error) => {
      console.error("Sign out error:", error);
    });
  };
  useEffect(() => {
    const userRef = firebase.firestore().collection("users");
  
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        userRef.doc(user.uid).get().then((document) => {
          const userdata = document.data() || null;
          setUser(userdata);
        }).catch(() => {
          setUser(null);
        });
      } else {
        setUser(null);
      }
    });

   

    return () => unsubscribe();
  }, []);

  
  return (
   <View style={styles.container}>
      <Button title="Sign Out" onPress={handleSignOut} />
   </View>
  );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width:"30%"
  },
});