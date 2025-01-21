import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { firebase } from "../../firebase/db";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SimpleLineIcons } from "@expo/vector-icons";

const UpdateBook = () => {
  const { id } = useLocalSearchParams(); // Get the book ID from the route params
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(null);
  const [disponibilite, setdisponibilite] = useState("");
const data2=["disponible","non disponible"]
  const ref = firebase.firestore().collection("books");
  const router = useRouter();

  // Fetch book details when the component mounts
  const loadBookData = async () => {
    const doc = await ref.doc(id).get();
    if (doc.exists) {
      const bookData = doc.data();
      setTitle(bookData.title || "");
      setAuthor(bookData.author || "");
      setGenre(bookData.genre || "");
      setImageUri(bookData.image || "");
    } else {
      Alert.alert("Error", "Book not found.");
    }
  };

  useEffect(() => {
    loadBookData();
  }, [id]);

  const PickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const source = { uri: result.assets[0].uri }; // Updated for latest API
      setImage(source);
      setImageUri(source.uri); // Update the image URI state
    }
  };

  const handleUpdate = async () => {
    try {
      await ref.doc(id).update({
        title: title,
        author: author,
        genre: genre,
        image: image ? image.uri : imageUri,

        disponibilite:disponibilite // Use the new image URI or the existing one
      });
      Alert.alert("Success", "Book updated successfully.");
      router.push("/");
    } catch (error) {
      console.error("Error updating book:", error);
      Alert.alert("Error", "Failed to update the book.");
    }
  };

  const data = [
    { key: "adventure", value: "Adventure" },
    { key: "drama", value: "Drama" },
    { key: "action", value: "Action" },
    { key: "comedy", value: "Comedy" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Image at the top */}
      <Image
        source={{ uri: "https://www.betterreading.com.au/wp-content/uploads/2020/11/Banners.png" }} // Use the URL directly
        style={styles.topImage}
      />

      {/* Form below the image */}
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholder="Book Title"
      />
      <TextInput
        value={author}
        onChangeText={setAuthor}
        style={styles.input}
        placeholder="Author"
      />
      <SelectList
        setSelected={setGenre}
        placeholder="Choose the genre"
        data={data}
        defaultOption={{ key: genre, value: genre }} // Set the default selected genre
        save="key"
        boxStyles={styles.selectListBox} // Apply the same styling as TextInput
        inputStyles={styles.selectListInput} // Style the input text
        dropdownStyles={styles.selectListDropdown} // Style the dropdown
      />
      <SelectList
      setSelected={setdisponibilite}
      placeholder="selectionner la disponibilité"
      data={data2}
      boxStyles={styles.selectListBox}
      inputStyles={styles.selectListInput}
      dropdownStyles={styles.selectListDropdown}
    />
      <TouchableOpacity onPress={PickImage}>
        <SimpleLineIcons
          name="camera"
          style={{ marginTop: 20, marginLeft: 10 }}
          color="#00B2FF"
          size={30}
        />
      </TouchableOpacity>
     
  
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update Book</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F4F4",
    padding: 20,
  },
  topImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    marginBottom: 20,
    borderRadius: 10,
  },
  input: {
    backgroundColor: "#fff",
    width: "100%",
    height: 50,
    padding: 12,
    marginTop: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
  },
  selectListBox: {
    width: "100%",
    height: 50,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  selectListInput: {
    fontSize: 16,
  },
  selectListDropdown: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginTop: 5,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#00B2FF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: "70%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default UpdateBook;