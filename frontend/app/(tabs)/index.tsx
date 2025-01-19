import { Image, StyleSheet, Platform,View,Text,Button } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState,createContext, useContext } from 'react';
import firebase from 'firebase/compat/app';
import { AuthContext } from '@/firebase/Authcontext';
import { useRouter } from 'expo-router';
import Login from "../Login"
export default function HomeScreen() {
  const auth = useContext(AuthContext);
 const [userData,setUser]=useState({email:"",
username:"",
role:"",id:""
})
  const router = useRouter();
  const handleSignOut = () => {
    firebase.auth().signOut().then(() => {
      router.push('/');  // Redirect to login screen after sign out
    }).catch((error) => {
      console.error("Sign out error:", error);
    });
  };
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
    <View >
    <View style={styles.signoutbuttoncontainer}>
     <Button title="Sign Out" onPress={handleSignOut} />
   </View>
   <View></View>
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
  signoutbuttoncontainer:{
    width:"30%",
    height:"30%",
marginTop:"20%",
marginLeft:"70%"
  }
});