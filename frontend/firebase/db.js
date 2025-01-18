// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth"
import "firebase/compat/firestore"
import "firebase/compat/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHyOiFWiXXZ0asfPT5OsF8AhCa9_21vV8",
  authDomain: "biblio-78405.firebaseapp.com",
  projectId: "biblio-78405",
  storageBucket: "biblio-78405.firebasestorage.app",
  messagingSenderId: "817284749443",
  appId: "1:817284749443:web:bdd995a6235dc5c1d1e3b6",
  measurementId: "G-PECQT88413"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
// Initialize Firebase
export { firebase }; 