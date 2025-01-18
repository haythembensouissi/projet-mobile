import { View, Text, TextInput, TouchableOpacity,StyleSheet } from 'react-native'
import React, { useState } from 'react'
import Register from "./Register"
import { Ionicons } from '@expo/vector-icons';
import { firebase } from "../firebase/db.js";
import { useRouter } from 'expo-router';
const Login = () => {
    const [email,setemail]=useState("")
    const [password,setpassword]=useState("")
    const [page,setpage]=useState("login")
    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter(); 
const handlesubmit=()=>{
  firebase.auth().signInWithEmailAndPassword(email,password).then(response =>{
    const uid=response.user.uid
    const userref=firebase.firestore().collection("users")
    userref.doc(uid).get().then(document=>{
      if(!document){
        alert("user does not exist")
        return;
      }
      setUser(document.data())
      router.push('/');
      
    })     .catch((error) => {
      alert(error);
    });
  })
}
  return (
    <View>
    {page=="login"?<View style={{marginTop:"20%"}}>
    <TextInput
    value={email}
    onChangeText={setemail}
    placeholder='email'
    style={styles.input}
  />
  <View style={styles.passwordContainer}>
    <TextInput
      value={password}
      secureTextEntry={!showPassword}
      onChangeText={setpassword}
      placeholder='password'
      style={[styles.input, styles.passwordInput]} // Style for password input
    />
    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconContainer}>
      <Ionicons
        name={showPassword ? 'eye-off' : 'eye'}
        size={24}
        color="gray"
      />
    </TouchableOpacity>
  </View>
    <View>
    <TouchableOpacity style={styles.button} onPress={handlesubmit}><Text>login</Text></TouchableOpacity>
    </View>
    <TouchableOpacity  onPress={()=>setpage("register")}><Text>dont have an account ?</Text><Text style={{color:"blue"}}>register</Text></TouchableOpacity>
    </View>:<Register page={page} setpage={setpage}/>}
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
    passwordContainer: {
      flexDirection: 'row', // Align input and icon in a row
      alignItems: 'center',  // Vertically center the items
      marginTop: 20,
      width: "40%",
    },
    inputcontainer: {
      width: "100%",
      height: "-50%",
      
      marginBottom: 40,
    },
    iconContainer: {
      marginLeft: "10%",  // Add some space between the input and icon
      marginTop:"20%"
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
      width:100,
      height: 48,
      borderRadius: 5,
      marginVertical: 3,
      marginBottom: 10,
      marginTop: 10, 
      marginLeft: 0,
  
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
    
  });
export default Login