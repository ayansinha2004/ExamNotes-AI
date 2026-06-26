
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "authexamnotes-f6486.firebaseapp.com",
  projectId: "authexamnotes-f6486",
  storageBucket: "authexamnotes-f6486.firebasestorage.app",
  messagingSenderId: "504889078579",
  appId: "1:504889078579:web:c87086bceeade76af04446",
  measurementId: "G-BXHP60YF3T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export { auth, provider }