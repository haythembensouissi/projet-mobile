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
import { SelectList } from "react-native-dropdown-select-list";
import { firebase } from "../../firebase/db";
import { async } from "@firebase/util";

const Addbook = () => {
  const [title, setTitle] = useState("");
  const [author, setauthor] = useState("");
  const [genre, setgenre] = useState("");
  const [userData, setUser] = useState({
    email: "",
    username: "",
    role: "",
    id: "",
  });

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
      isAvailable: true,
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
