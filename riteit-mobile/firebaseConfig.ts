import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: Replace with your actual Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDl31IlFb_T3PwON-oefHT1PyBxFEiX6iE",
  authDomain: "rite-it.firebaseapp.com",
  projectId: "rite-it",
  storageBucket: "rite-it.firebasestorage.app",
  messagingSenderId: "496938867372",
  appId: "1:496938867372:web:774d9ab45d1aef99721d09",
  measurementId: "G-HK3BRC6R5R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);
