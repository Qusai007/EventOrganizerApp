import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAF4pOHorUhXtepTi44xCL2esqBya37H4k",
  authDomain: "eventorganizerapp-1f5ba.firebaseapp.com",
  projectId: "eventorganizerapp-1f5ba",
  storageBucket: "eventorganizerapp-1f5ba.firebasestorage.app",
  messagingSenderId: "804772407031",
  appId: "1:804772407031:web:90fe40110d8272364155f2",
  measurementId: "G-4LRSGNG0PX"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
