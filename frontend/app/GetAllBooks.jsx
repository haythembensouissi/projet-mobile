import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, Image,RefreshControl, ActivityIndicator, Alert, Button, TouchableOpacity,ScrollView } from "react-native";
import { firebase } from "../firebase/db";
import { Link } from "expo-router";

export default function GetAllBooks({user,books}) {
 

  const renderBookCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.author}>By {item.author}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <TouchableOpacity style={styles.linkButton}>
        <Link
          href={{
            pathname: `/emprunt/${item.id}`,
            params: { id: item.id, user, userid: user.id },
          }}
          push
        >
          <Text style={styles.linkButtonText}>Emprunter</Text>
        </Link>
      </TouchableOpacity>
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
});
