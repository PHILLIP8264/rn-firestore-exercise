import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCw53j3ZqBAQFO_aiMIOebFRK8UxNiGMzA",
  authDomain: "class-activeties.firebaseapp.com",
  projectId: "class-activeties",
  storageBucket: "class-activeties.firebasestorage.app",
  messagingSenderId: "253070327629",
  appId: "1:253070327629:web:a69f6644fe7145909cc104",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
