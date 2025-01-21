import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, Image,RefreshControl, ActivityIndicator, Alert, Button, TouchableOpacity,ScrollView } from "react-native";
import { firebase } from "../firebase/db";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // For icons

export default function GetAllBooks({user,books,fetchBooks}) {
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

  const renderBookCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.author}>By {item.author}</Text>
      <Text style={styles.description}>{item.description}</Text>
      
      
      <View style={styles.iconContainer}>
        {/* Save Icon */}
        
        {item.disponibilite=="disponible"&&  <TouchableOpacity onPress={() => handleSave(item.id)}>
          <Link
            href={{
              pathname: `/emprunt/${item.id}`,
              params: { id: item.id, user, userid: user.id },
            }}
            push
          > <Ionicons name="bookmark-outline" size={24} color="#000" />  </Link>
        </TouchableOpacity>
       
            
}
      
        {/* Like Icon */}
        <TouchableOpacity onPress={() => handleLike(item.id)}>
          <Ionicons name="heart-outline" size={24} color="#ff0000" />
        </TouchableOpacity>
{user.role=="admin"&&<>
<Link
href={{
  pathname: `/update/${item.id}`,
  params: { id: item.id},
}}
push
> 
<Ionicons name="create-outline" size={24} color="#000" />
</Link>

{/* Delete Icon */}
<TouchableOpacity onPress={() => handleDelete(item.id)}>
<Ionicons name="trash-outline" size={24} color="#ff0000" />
</TouchableOpacity>
</>}
     
      </View>
    </View>
  );
  

  return (
  
    <View style={styles.container}>

        <FlatList
          data={books}
          renderItem={renderBookCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer} />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  author: {
    fontSize: 16,
    color: "#666",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
  },
  linkButton: {
    backgroundColor: "#007BFF",
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10, // Adds space between the description and button
  },
  linkButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkButtonActive: {
    backgroundColor: "#0056b3", // Darker shade when pressed
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginLeft:"10%",
    gap: 16, // Space between icons
  },
});
