// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// The app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgt0Y9Bdn1Hycx0olOrcbHtUIZJF-z4Sg",
  authDomain: "learn-fitness-2024.firebaseapp.com",
  projectId: "learn-fitness-2024",
  storageBucket: "learn-fitness-2024.appspot.com",
  messagingSenderId: "17750592298",
  appId: "1:17750592298:web:169995a0e55b32f1fe6c53",
  measurementId: "G-59G45FN7PL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Auth with persistent storage
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});
// Initialize Firebase Firestore and get a reference to the service
const firestore = getFirestore(app);

export { auth, firestore };