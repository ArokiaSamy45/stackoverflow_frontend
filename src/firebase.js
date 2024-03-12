// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbLDXnmqpTumbQR4EzLW9hW8vCfT0TuVE",
  authDomain: "authentication-34013.firebaseapp.com",
  projectId: "authentication-34013",
  storageBucket: "authentication-34013.appspot.com",
  messagingSenderId: "647648584238",
  appId: "1:647648584238:web:fbd977543267adcd49f5bf",
  measurementId: "G-QTSZVE7H0C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

export const getFirebaseAuthToken = async () => {
  try {
    const token = await auth.currentUser.getIdToken();
    return token;
  } catch (error) {
    console.error('Error obtaining Firebase ID token:', error);
    throw error;
  }
};

export { auth, provider };

