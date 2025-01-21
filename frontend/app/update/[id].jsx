import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { SelectList } from "react-native-dropdown-select-list";
  import { firebase } from "../../firebase/db";
  import * as ImagePicker from "expo-image-picker";

import { useLocalSearchParams,useRouter } from "expo-router";
import { Entypo, FontAwesome, AntDesign,Ionicons,Feather,SimpleLineIcons } from "@expo/vector-icons";

  const UpdateBook = () => {
    const { id } = useLocalSearchParams();
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [genre, setGenre] = useState("");
    const [imageUri, setImageUri] = useState("");
    const [uploading, setUploading] = useState(false);
    const [image, setImage] = useState(null);

    const ref = firebase.firestore().collection("books");
  const router=useRouter()
    const loadBookData = async () => {
      const doc = await ref.doc(bookId).get();
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
    }, []);
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
      }
    };
    
    const handleUpdate = async () => {
      await ref.doc(id).update({
        title: title,
        author: author,
        genre: genre,
        image: image.uri,
      });
      Alert.alert("Success", "Book updated successfully.");
    router.push("/")
    };
  
    return (
      <View style={styles.container}>
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
          data={["adventure", "drama", "action", "comedy"]}
          defaultOption={{ key: genre, value: genre }}
        />
        <TouchableOpacity onPress={PickImage}>
        <SimpleLineIcons
          name="camera"
          style={{ marginTop: 20, marginLeft: 10}}
          color="#00B2FF" 
          size={30}
        ></SimpleLineIcons>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>

          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Update Book</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F4F4F4",
      padding: 20,
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
    image: {
      width: 100,
      height: 100,
      marginTop: 20,
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
  