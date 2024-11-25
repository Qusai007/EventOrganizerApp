import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth/react-native';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence } from 'firebase/auth/react-native';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAF4pOHorUhXtepTi44xCL2esqBya37H4k",
  authDomain: "eventorganizerapp-1f5ba.firebaseapp.com",
  projectId: "eventorganizerapp-1f5ba",
  storageBucket: "eventorganizerapp-1f5ba.appspot.com",
  messagingSenderId: "804772407031",
  appId: "1:804772407031:web:90fe40110d8272364155f2",
  measurementId: "G-4LRSGNG0PX"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Use AsyncStorage for Auth persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const firestore = getFirestore(app);

export { auth, firestore };
