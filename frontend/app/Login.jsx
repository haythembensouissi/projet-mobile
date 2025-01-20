import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React, { useState } from 'react';
import Register from "./Register";
import { Ionicons } from '@expo/vector-icons';
import { firebase } from "../firebase/db.js";
import { useRouter } from 'expo-router';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [page, setPage] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleSubmit = () => {
    firebase.auth().signInWithEmailAndPassword(email, password).then(response => {
      const uid = response.user.uid;
      const userRef = firebase.firestore().collection("users");
      userRef.doc(uid).get().then(document => {
        if (!document.exists) {
          alert("User does not exist");
          return;
        }
        setUser(document.data());
        router.push('/');
      }).catch((error) => {
        alert(error);
      });
    }).catch((error) => {
      alert(error);
    });
  };

  return (
    <View style={styles.container}>
      {page === "login" ? (
        <View style={styles.formContainer}>
          {/* Title */}
          <Text style={styles.title}>Welcome to LemonPie!</Text>

          {/* Quote About Reading */}
          <Text style={styles.quote}>"Reading is to the mind what exercise is to the body."</Text>

          {/* Email Input */}
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#000" // Black placeholder
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Password Input */}
          <View style={styles.passwordContainer}>
            <TextInput
              value={password}
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#000" // Black placeholder
              style={styles.passwordInput}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.iconContainer}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          {/* Forgot Password Link */}
          <TouchableOpacity style={styles.forgotPasswordLink}>
            <Text style={styles.linkText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Register Link */}
          <TouchableOpacity onPress={() => setPage("register")} style={styles.registerLink}>
            <Text>Don't have an account? <Text style={styles.linkText}>Register!</Text></Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Register page={page} setPage={setPage} />
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
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  quote: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
    fontStyle: "italic",
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
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    width: "100%",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  passwordInput: {
    flex: 1,
    height: 50,
    padding: 12,
  },
  iconContainer: {
    padding: 10,
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
  forgotPasswordLink: {
    marginTop: 15,
  },
  registerLink: {
    marginTop: 15,
  },
  linkText: {
    color: "#00B2FF",
    fontWeight: "bold",
  },
});

export default Login;