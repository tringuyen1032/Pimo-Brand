import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import "firebase/compat/database";
import "firebase/compat/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
   apiKey: "AIzaSyAm-3UepbHMPYm16tgLA1M98XD8s97sXO4",
   authDomain: "pimo-fc268.firebaseapp.com",
   projectId: "pimo-fc268",
   storageBucket: "pimo-fc268.appspot.com",
   messagingSenderId: "1000934922231",
   appId: "1:1000934922231:web:ea2927c170c5fd294a40f2",
   measurementId: "G-69ECDJTWVM"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider }
export const realtimeDB = firebase.database();
export default db;