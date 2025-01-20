import React, { useEffect, useState, useContext } from "react";
import { View, Text, Button,RefreshControl, StyleSheet,ScrollView,Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "@/firebase/Authcontext";
import GetAllBooks from "../GetAllBooks"; // Correct import for default export
import firebase from 'firebase/compat/app';

export default function HomeScreen() {
  type Book = {
    id: string;
    title: string;
    author: string;
    description: string;
    image: string;
  };
  
  const [books, setBooks] = useState<Book[]>([]);
  const auth = useContext(AuthContext);
  const router = useRouter();
  const [userData, setUser] = useState({ email: "", username: "", role: "", id: "" });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
useEffect(() => {
    console.log("Fetching data...");  // Add this log to check if effect runs
    const fetchData = async () => {
      await getUser();
      await fetchBooks();
    };
    fetchData();
  }, []);
  const fetchBooks = async () => {
    setLoading(true); // Mark loading before starting
    try {
      const ref = firebase.firestore().collection("books");
      const snapshot = await ref.get();
      if (snapshot.empty) {
        console.warn("No books found in Firestore.");
      } else {
        const booksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || "No Title",
          author: doc.data().author || "Unknown Author",
          description: doc.data().description || "No description available.",
          image: doc.data().image || "https://via.placeholder.com/150",
        }));
        setBooks(booksData);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      Alert.alert("Error", "Failed to fetch books. Please try again later.");
    } finally {
      setLoading(false); // Stop loading
    }
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    fetchBooks().finally(() => {
      setRefreshing(false);
    });
  };
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
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading books...</Text>
      </View>
    );
  }

  if (books.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No books found.</Text>
      </View> 
    );
  }
  
  
  
  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}  style={styles.container}>
      <View style={styles.signoutbuttoncontainer}>
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>

      {/* Render the GetAllBooks component */}
      <GetAllBooks  user={userData} books={books} fetchBooks={fetchBooks} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    padding: 20,
  },
  signoutbuttoncontainer: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  signoutButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  signoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
