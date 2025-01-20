import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { firebase } from "../firebase/db.js";
import { SelectList } from "react-native-dropdown-select-list";

const Register = ({ page, setPage }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const data = ["admin", "normal user"];

  const handleSubmit = () => {
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
          setEmail("");
          setUsername("");
          setPassword("");
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
            {/* Title */}
            <Text style={styles.title}>Register</Text>

            {/* Username Input */}
            <View style={styles.inputContainer}>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                placeholderTextColor="#000" // Black placeholder
                style={styles.input}
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="#000" // Black placeholder
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <TextInput
                value={password}
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#000" // Black placeholder
                style={styles.input}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.iconContainer}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            {/* Role Selection */}
            <View style={styles.roleContainer}>
              <SelectList
                setSelected={setRole}
                placeholder="Choose Role"
                placeholderTextColor="#000" // Black placeholder
                data={data}
                search={false}
                boxStyles={styles.selectListBox}
                inputStyles={styles.selectListInput}
                dropdownStyles={styles.selectListDropdown}
              />
            </View>

            {/* Register Button */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity onPress={() => setPage("login")} style={styles.linkContainer}>
              <Text>Have an account? </Text>
              <Text style={styles.linkText}>Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  formContainer: {
    width: "90%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent white background
    borderRadius: 8,
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    width: "100%",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 50,
    padding: 12,
  },
  iconContainer: {
    padding: 10,
  },
  roleContainer: {
    width: "100%",
    marginTop: 15,
  },
  selectListBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  selectListInput: {
    color: "#000", // Black text for selected value
  },
  selectListDropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#00B2FF",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  linkContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  linkText: {
    color: "#00B2FF",
    fontWeight: "bold",
  },
});

export default Register;