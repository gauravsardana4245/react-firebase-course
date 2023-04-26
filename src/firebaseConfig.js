
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyANcgBbahuQv1qh7iMGBYEQ8xhUGPJgjf8",
    authDomain: "fir-frontend-9618a.firebaseapp.com",
    projectId: "fir-frontend-9618a",
    storageBucket: "fir-frontend-9618a.appspot.com",
    messagingSenderId: "506464416964",
    appId: "1:506464416964:web:36cd8d9b94a739c88d4591",
    measurementId: "G-36XVYF6JNP"
};


export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
export const storage = getStorage(app)