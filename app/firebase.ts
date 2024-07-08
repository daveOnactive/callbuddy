// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACSXUaXBBpHSuYTsqBLPVJyjUAExyux7E",
  authDomain: "callbuddy-1deba.firebaseapp.com",
  projectId: "callbuddy-1deba",
  storageBucket: "callbuddy-1deba.appspot.com",
  messagingSenderId: "1053208019643",
  appId: "1:1053208019643:web:141941074f2581730c9f9e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {});
