// Firebase.js is the setup connection between the toDolistApp and the Google Firebase which is responsible for storing the data in the database and the Authentication process
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDn40FYFzuwLgUAMupepRR7ypblSajfdjs",
  authDomain: "todo-list-f017a.firebaseapp.com",
  projectId: "todo-list-f017a",
  storageBucket: "todo-list-f017a.appspot.com",
  messagingSenderId: "317473937084",
  appId: "1:317473937084:web:b927b1f0dae8f5b4a7a2b9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db ,auth, signOut };