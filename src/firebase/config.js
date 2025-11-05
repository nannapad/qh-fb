// Firebase configuration and initialization

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// TODO: Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCgY2YeRSc9SUQuINA-hGMVdht8nYuCWXM",
  authDomain: "quick-help-cca3a.firebaseapp.com",
  projectId: "quick-help-cca3a",
  storageBucket: "quick-help-cca3a.firebasestorage.app",
  messagingSenderId: "653723391993",
  appId: "1:653723391993:web:60045403f7390b89ad0f28"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Functions
export const functions = getFunctions(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
