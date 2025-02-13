// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDIFFHipDJsZ1AiMyHGDN1NsJyXvyIxQc",
  authDomain: "qwert-c94af.firebaseapp.com",
  projectId: "qwert-c94af",
  storageBucket: "qwert-c94af.qwert-c94af.firebasestorage.app",
  messagingSenderId: "971892024063",
  appId: "1:971892024063:web:4de54c1174d963486322ca",
  measurementId: "G-PE5RRK8ZDV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
