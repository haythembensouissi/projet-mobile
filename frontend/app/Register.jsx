import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { firebase } from "../firebase/db.js";
import { SelectList } from "react-native-dropdown-select-list";

import bcrypt from 'bcryptjs'; 
const Register = ({ page, setpage }) => {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [role, setrole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const data=["admin","normal user"]

  const handlesubmit = () => {
   firebase.auth().createUserWithEmailAndPassword(email,password).then((response )=>{
    const uid=response.user.uid
    const data={
      id:uid,
      username:username,
      email:email,
      password:password,
      role:role
    }
    const usersRef = firebase.firestore().collection("users");
        usersRef
          .doc(uid)
          .set(data)
          .then(() => {
           alert("user added")
           setemail("")
           setusername("")
           setpassword("")
          })
          .catch((error) => {
            alert(error);
          });
   })   .catch((error) => {
    alert(error);
  });
  }

  return (
    <View>
      {page == "login" ? <Login /> : <View style={{ marginTop: "20%" }}>
        <TextInput
          value={username}
          onChangeText={setusername}
          placeholder='username'
          style={styles.input}
        />
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
        <SelectList setSelected={setrole} placeholder="choisir le role" data={data}/>
        <TouchableOpacity style={styles.button} onPress={handlesubmit}>
          <Text>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setpage("login")}>
          <Text>Have an account? </Text><Text style={{ color: "blue" }}>Login</Text>
        </TouchableOpacity>
      </View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  input: {
    backgroundColor: "#fff",
    marginTop: 20,
    width: "100%",
    height: 50,
    padding: 12,
    borderRadius: 5,
  },
  passwordContainer: {
    flexDirection: 'row', // Align input and icon in a row
    alignItems: 'center',  // Vertically center the items
    marginTop: 20,
    width: "40%",
  },
  passwordInput: {
    flex: 1, // Make the password input take up the remaining space
  },
  iconContainer: {
    marginLeft: "10%",  // Add some space between the input and icon
    marginTop:"20%"
  },
  button: {
    backgroundColor: "#00B2FF",
    padding: 15,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 16,
    width: 100,
    height: 48,
    borderRadius: 5,
    marginVertical: 3,
    marginBottom: 10,
    marginTop: 10,
  },
});

export default Register;
