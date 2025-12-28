// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBAGmnxAJYz1WBdtGFEaVatQTCNhK__2Lg",
  authDomain: "kidzet-5cf0a.firebaseapp.com",
  databaseURL: "https://kidzet-5cf0a-default-rtdb.firebaseio.com",
  projectId: "kidzet-5cf0a",
  storageBucket: "kidzet-5cf0a.firebasestorage.app",
  messagingSenderId: "60263795774",
  appId: "1:60263795774:web:2745f71208e3692976956f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const database = getDatabase(app);