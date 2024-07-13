// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJe3AxhaFM4689QhX1BIH-gkaeau6AUTw",
  authDomain: "callbuddy-b2624.firebaseapp.com",
  projectId: "callbuddy-b2624",
  storageBucket: "callbuddy-b2624.appspot.com",
  messagingSenderId: "219560982387",
  appId: "1:219560982387:web:4d1866f13821ef7c34b706",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {});
