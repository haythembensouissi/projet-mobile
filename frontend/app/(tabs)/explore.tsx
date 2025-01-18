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
import {firebase} from "../../firebase/db"
import { async } from "@firebase/util";

const Addbook = () => {
  const [title,setTitle]=useState("")
  const [author,setauthor]=useState("")
  const [genre,setgenre]=useState("")
  const ref=firebase.firestore().collection("books")
const handlesubmit=async()=>
{
await ref.add({
  title:title,
  isAvailable:true
})
setTitle("")
setauthor("")
setgenre("choisir le genre")
}
const data=["adventure","drama","action","comedy"]
return (
  <View>
    <TextInput multiline={false} value={title} onChangeText={setTitle} style={styles.input} placeholder="what is the title"/>
    <TextInput value={author} onChangeText={setauthor} style={styles.input} placeholder="what is the author"/>
    <SelectList setSelected={setgenre} placeholder="choisir le genre" data={data}/>
    
    <View style={styles.button}>
      <TouchableOpacity style={styles.but} onPress={() => handlesubmit()}>
        <Text style={styles.buttontext}>Add</Text>
      </TouchableOpacity>
  S</View>
  </View>
)
}
const styles= StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  inputcontainer: {
    width: "100%",
    height: "-50%",
    
    marginBottom: 40,
  },
  input: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,

    textAlignVertical: "top",

    width: "100%",
    
    height:50,
    padding: 12,
    borderRadius: 5,
    //     box-sizing: border-box;
    //     border: 2px solid #ccc;
    //     border-radius: 4px;
    //     background-color: #f8f8f8;
    //     font-size: 16px;
    //     resize: none;
    //   }
  },
  button: {
    backgroundColor: "#00B2FF",
    padding: 15,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 16,
    height: 48,
    borderRadius: 5,
    marginVertical: 3,
    marginBottom: 10,
    marginTop: 10, 
    marginLeft: 85,

  },
  but: {
    textAlign: "center",
    alignItems: "center",
  },
  buttontext: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
  buttoncontainer: {
    width: "100%",
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    marginLeft: 10,
    margin: 10,
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
  author:{
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 20,
    marginLeft: 5
},
author1:{
  fontWeight: "bold",
  fontSize: 15,
  marginTop: 25,
  marginLeft: 15,
},
});

export default Addbook