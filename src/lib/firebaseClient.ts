// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDR-xa5TQ-wnzkCYW3Iqihv-hiO7AEIyIo',
  appId: '1:916646962922:android:44dbc94a5f526d92dd9993',
  messagingSenderId: '916646962922',
  projectId: 'windowshopai-36c5c',
  storageBucket: 'windowshopai-36c5c.appspot.com',
  authDomain: 'windowshop.ai',
  measurementId: 'G-852XK9MVNV',
};

// Initialize Firebase
export const firebaseClientApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseClientApp);
export const firestore = getFirestore(firebaseClientApp);
export const db = getFirestore(firebaseClientApp);
