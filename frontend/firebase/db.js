import firebase from "firebase/compat/app";
import "firebase/compat/auth"
import "firebase/compat/firestore"
import "firebase/compat/storage"


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
    console.log("you have no dbs")
}

export { firebase }; 