import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyB_MvhwOPfET9zMWMRIUSOvtXJI_QFHXMg",
  authDomain: "collaborationsuite-e7701.firebaseapp.com",
  projectId: "collaborationsuite-e7701",
  storageBucket: "collaborationsuite-e7701.appspot.com", // Ensure this is correct
  messagingSenderId: "832603649443",
  appId: "1:832603649443:web:943e725325e8ed992a1616",
  measurementId: "G-JQPG5TCMXM",
  databaseURL: "https://collaborationsuite-e7701-default-rtdb.firebaseio.com/", // Include database URL
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);
const database = getDatabase(app);
const storage = getStorage(app);

// Export services
export { auth, firestore, database, storage };
export default app;





