// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB998t1YmgrihPARTuJURvZk7EXDWvoG2E",
  authDomain: "blood-bank-356a1.firebaseapp.com",
  projectId: "blood-bank-356a1",
  storageBucket: "blood-bank-356a1.appspot.com",
  messagingSenderId: "439887172797",
  appId: "1:439887172797:web:31a43e7d03f2bee63153d4",
  measurementId: "G-43GG7LPNBX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db }; 