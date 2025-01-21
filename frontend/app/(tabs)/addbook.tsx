import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { SimpleLineIcons } from "@expo/vector-icons";
import { SelectList } from "react-native-dropdown-select-list";
import { firebase } from "../../firebase/db";
import * as ImagePicker from "expo-image-picker";

const Addbook = () => {
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [selectedImage, setSelectedImage] = useState<{ uri: string } | null>(null);

  const PickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const source = { uri: result.assets[0].uri }; // Updated for latest API
      setSelectedImage(source);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      console.warn("No image selected.");
      return null;
    }
    setUploading(true);
    try {
      const response = await fetch(selectedImage.uri);
      const blob = await response.blob();
      const filename = selectedImage.uri.substring(selectedImage.uri.lastIndexOf("/") + 1);
      const storageRef = firebase.storage().ref().child(filename);

      const uploadTask = storageRef.put(blob);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            console.error("Error during upload:", error);
            reject(error);
          },
          async () => {
            const downloadURL = await storageRef.getDownloadURL();
            console.log("File available at:", downloadURL);
            setSelectedImage(null); // Reset the image after upload
            resolve(downloadURL); // Return the URL
          }
        );
      });
    } catch (e) {
      console.error("Error uploading image:", e);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
   

    const ref = firebase.firestore().collection("books");
    await ref.add({
      title: title,
      author: author,
      genre: genre,
      isAvailable: true,
      image: selectedImage?.uri, // Use the uploaded image URL
    });
    setTitle("");
    setAuthor("");
    setGenre("choisir le genre");
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
        multiline={false}
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholder="What is the title?"
      />
      <TextInput
        value={author}
        onChangeText={setAuthor}
        style={styles.input}
        placeholder="Who is the author?"
      />
      <SelectList
        setSelected={setGenre}
        placeholder="Choose the genre"
        data={data}
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
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Add Book</Text>
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
    marginTop: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
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

export default Addbook;