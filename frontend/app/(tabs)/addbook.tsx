import {
    Alert,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    FlatList,
    ScrollView,
    Platform,
    useColorScheme,
  } from "react-native";
  import React, { useCallback, useEffect, useState } from "react";
  import { Entypo, FontAwesome, AntDesign,Ionicons,Feather,SimpleLineIcons } from "@expo/vector-icons";
  import { SelectList } from "react-native-dropdown-select-list";
  import { firebase } from "../../firebase/db";
  import { async } from "@firebase/util";
  import * as ImagePicker from "expo-image-picker";
  const Addbook = () => {
    const [uploading, setUploading] = useState(false);
    const [title, setTitle] = useState("");
    const [author, setauthor] = useState("");
    const [genre, setgenre] = useState("");
    const [image, setImage] = useState<{ uri: string } | null>(null);
    const [userData, setUser] = useState({
      email: "",
      username: "",
      role: "",
      id: "",
    });
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
    
    const UploadImage = async () => {
      if (!image) {
        console.warn("No image selected.");
        return;
      }
      setUploading(true);
      try {
        const response = await fetch(image.uri);
        const blob = await response.blob();
        const filename = image.uri.substring(image.uri.lastIndexOf("/") + 1);
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
              setImage(null); // Reset the image after upload
              resolve(downloadURL); // Return the URL
            }
          );
        });
      } catch (e) {
        console.error("Error uploading image:", e);
      } finally {
        setUploading(false);
      }
    };
    
    const getUser = () => {
      const usersRef = firebase.firestore().collection("users");
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          await usersRef
            .doc(user.uid)
            .get()
            .then((document) => {
              if (document.exists) {
                const data = document.data() || {};
                setUser({
                  id: document.id,
                  email: data.email || "",
                  username: data.username || "",
                  role: data.role || "",
                });
              } else {
                console.warn("No user document found.");
              }
            })
            .catch((error) => {
              console.error("Error fetching user data:", error);
            });
        }
      });
    };
  
    useEffect(() => {
      getUser();
    }, []);
  
    const ref = firebase.firestore().collection("books");
  
    const handlesubmit = async () => {
      await ref.add({
        title: title,
        author:author,
        genre:genre,
        isAvailable: true,
        image:image?.uri
      });
      setTitle("");
      setauthor("");
      setgenre("choisir le genre");
    };
  
    const data = ["adventure", "drama", "action", "comedy"];
  
    return (
      <View style={styles.container}>
        <TextInput
          multiline={false}
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          placeholder="What is the title?"
        />
        <TextInput
          value={author}
          onChangeText={setauthor}
          style={styles.input}
          placeholder="Who is the author?"
        />
        <SelectList
          setSelected={setgenre}
          placeholder="Choose the genre"
          data={data}
          style={styles.selectList}
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
          <TouchableOpacity style={styles.button} onPress={() => handlesubmit()}>
            <Text style={styles.buttonText}>Add Book</Text>
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
    selectList: {
      width: "100%",
      marginTop: 15,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: "#ccc",
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
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
    camerabutton: {
      marginTop: 20,
      width: 50,
      height: 50,
      textAlign: "center",
      backgroundColor: "#14b8a6",
      flex: 1,
      borderRadius: 10,
    },
    pdfbut: {
      marginTop: 20,
      width: 50,
      height: 50,
      textAlign: "center",
      backgroundColor: "#14b8a6",
      flex: 1,
      borderRadius: 10,
    },
    localisation: {
      marginTop: 20,
      borderRadius: 10,
      width: 50,
      height: 50,
      textAlign: "center",
      backgroundColor: "#14b8a6",
      flex: 1,
      marginLeft: 10,
      margin: 10,
    },
  });
  
  export default Addbook;
  