import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { firebase } from "../firebase/db.js";
import { SelectList } from "react-native-dropdown-select-list";

const Register = ({ page, setpage }) => {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [role, setrole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const data = ["admin", "normal user"];

  const handlesubmit = () => {
    firebase.auth().createUserWithEmailAndPassword(email, password).then((response) => {
      const uid = response.user.uid;
      const data = {
        id: uid,
        username: username,
        email: email,
        password: password,
        role: role,
      };
      const usersRef = firebase.firestore().collection("users");
      usersRef
        .doc(uid)
        .set(data)
        .then(() => {
          alert("User added");
          setemail("");
          setusername("");
          setpassword("");
        })
        .catch((error) => {
          alert(error);
        });
    }).catch((error) => {
      alert(error);
    });
  };

  return (
    <View style={styles.container}>
      {page === "login" ? (
        <Login />
      ) : (
        <View style={styles.formContainer}>
          <TextInput
            value={username}
            onChangeText={setusername}
            placeholder="Username"
            style={styles.input}
          />
          <TextInput
            value={email}
            onChangeText={setemail}
            placeholder="Email"
            style={styles.input}
            keyboardType="email-address"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              value={password}
              secureTextEntry={!showPassword}
              onChangeText={setpassword}
              placeholder="Password"
              style={[styles.input, styles.passwordInput]}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconContainer}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          <SelectList setSelected={setrole} placeholder="Choose Role" data={data} style={styles.selectList} />
          <TouchableOpacity style={styles.button} onPress={handlesubmit}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setpage("login")} style={styles.linkContainer}>
            <Text>Have an account? </Text><Text style={styles.linkText}>Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 20,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  input: {
    backgroundColor: "#fff",
    marginTop: 15,
    width: "100%",
    height: 50,
    padding: 12,
    borderRadius: 5,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    width: "100%",
  },
  passwordInput: {
    flex: 1,
  },
  iconContainer: {
    marginLeft: 10,
  },
  selectList: {
    marginTop: 25, // Increased margin to create space between password and role inputs
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  button: {
    backgroundColor: "#00B2FF",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  linkContainer: {
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  linkText: {
    color: "#00B2FF",
    fontWeight: "bold",
  },
});

export default Register;
