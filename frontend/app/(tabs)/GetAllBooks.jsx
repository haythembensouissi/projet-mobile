import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { firebase } from "../../firebase/db";
import { Ionicons } from "@expo/vector-icons"; // For icons

const GetAllBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch books from Firestore
  const fetchBooks = async () => {
    try {
      const ref = firebase.firestore().collection("books");
      const snapshot = await ref.get();
      const booksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title || "No Title",
        author: doc.data().author || "Unknown Author",
        description: doc.data().description || "No description available.",
        image: doc.data().image || "https://via.placeholder.com/150",
      }));
      setBooks(booksData);
    } catch (error) {
      console.error("Error fetching books:", error);
      Alert.alert("Error", "Failed to fetch books. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle saving a book
  const handleSave = (bookId) => {
    Alert.alert("Saved", `Book ${bookId} has been saved to your list.`);
    // Add logic to save the book to the user's saved list in Firestore
  };

  // Handle liking a book
  const handleLike = (bookId) => {
    Alert.alert("Liked", `Book ${bookId} has been added to your liked list.`);
    // Add logic to like the book in Firestore
  };

  // Handle editing a book
  const handleEdit = (bookId) => {
    Alert.alert("Edit", `Edit book ${bookId}`);
    // Add logic to navigate to an edit screen or open a modal
  };

  // Handle deleting a book
  const handleDelete = async (bookId) => {
    try {
      await firebase.firestore().collection("books").doc(bookId).delete();
      Alert.alert("Deleted", `Book ${bookId} has been deleted.`);
      fetchBooks(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting book:", error);
      Alert.alert("Error", "Failed to delete the book.");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Render each book as a card
  const renderBookCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.author}>By {item.author}</Text>
      <Text style={styles.description}>{item.description}</Text>

      {/* Icons for Save, Like, Edit, and Delete */}
      <View style={styles.iconContainer}>
        {/* Save Icon */}
        <TouchableOpacity onPress={() => handleSave(item.id)}>
          <Ionicons name="bookmark-outline" size={24} color="#000" />
        </TouchableOpacity>

        {/* Like Icon */}
        <TouchableOpacity onPress={() => handleLike(item.id)}>
          <Ionicons name="heart-outline" size={24} color="#ff0000" />
        </TouchableOpacity>

        {/* Edit Icon */}
        <TouchableOpacity onPress={() => handleEdit(item.id)}>
          <Ionicons name="create-outline" size={24} color="#000" />
        </TouchableOpacity>

        {/* Delete Icon */}
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={24} color="#ff0000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Show a loading indicator while fetching data
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading books...</Text>
      </View>
    );
  }

  // Show a message if no books are found
  if (books.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No books found.</Text>
      </View>
    );
  }

  // Render the list of books
  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderBookCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#333",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16, // Space between icons
  },
});

export default GetAllBooks;