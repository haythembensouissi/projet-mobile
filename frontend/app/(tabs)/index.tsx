import React, { useEffect, useState, useContext } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "@/firebase/Authcontext";
import GetAllBooks from "./GetAllBooks"; // Correct import for default export
import firebase from 'firebase/compat/app';
export default function HomeScreen() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const [userData, setUser] = useState({ email: "", username: "", role: "", id: "" });

  const handleSignOut = () => {
    firebase.auth().signOut().then(() => {
      router.push('/');
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
    getUser();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.signoutbuttoncontainer}>
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>

      {/* Render the GetAllBooks component */}
      <GetAllBooks />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  signoutbuttoncontainer: {
    width: "30%",
    height: "30%",
    marginTop: "20%",
    marginLeft: "70%",
  },
});