import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
// ==============================================================================
// ========================================= authentication ===================== 
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// ==============================================================================
// =================================== fire store =============================== 
import {
    getFirestore, collection, addDoc, doc, onSnapshot, setDoc, getDoc, query, where, updateDoc, deleteDoc,serverTimestamp ,getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// =============================== image-storage =====================
import { getStorage, ref , uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyCNLLVAJDsvgEujEbHWjHTykGL5O-HDPQE",
    authDomain: "hackathon-batch-10.firebaseapp.com",
    projectId: "hackathon-batch-10",
    storageBucket: "hackathon-batch-10.appspot.com",
    messagingSenderId: "644990541146",
    appId: "1:644990541146:web:2c4071891ecc3f634ba763",
    measurementId: "G-WN4BG6E1F9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app)
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage();


export {
    auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut,
    db, getFirestore, collection, addDoc, doc, onSnapshot, setDoc, getDoc, query, where, updateDoc, deleteDoc ,serverTimestamp ,getDocs,
    getStorage, ref , uploadBytesResumable, getDownloadURL,storage
}