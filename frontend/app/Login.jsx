import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Register from "./Register";
import { Ionicons } from '@expo/vector-icons';
import { firebase } from "../firebase/db.js";
import { useRouter } from 'expo-router';

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [page, setpage] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handlesubmit = () => {
    firebase.auth().signInWithEmailAndPassword(email, password).then(response => {
      const uid = response.user.uid;
      const userref = firebase.firestore().collection("users");
      userref.doc(uid).get().then(document => {
        if (!document) {
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
  }

  return (
    <View style={styles.container}>
      {page === "login" ? (
        <View style={styles.formContainer}>
          <TextInput
            value={email}
            onChangeText={setemail}
            placeholder='Email'
            style={styles.input}
            keyboardType="email-address"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              value={password}
              secureTextEntry={!showPassword}
              onChangeText={setpassword}
              placeholder='Password'
              style={[styles.input, styles.passwordInput]}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconContainer}>
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handlesubmit}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setpage("register")} style={styles.registerLink}>
            <Text>Don't have an account? <Text style={styles.linkText}>Register</Text></Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Register page={page} setpage={setpage} />
      )}
    </View>
  );
}

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
    elevation: 5,  // Adding shadow for Android
    shadowColor: "#000",  // iOS shadow
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
    flexDirection: 'row', 
    alignItems: 'center',
    marginTop: 15,
    width: "100%",
  },
  passwordInput: {
    flex: 1,
  },
  iconContainer: {
    marginLeft: 10,
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
  registerLink: {
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  linkText: {
    color: "#00B2FF",
    fontWeight: "bold",
  },
});

export default Login;
