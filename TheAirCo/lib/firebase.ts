import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBKF09ztMp0t8B7rEAgTq0gBRsOBldltAs",
  authDomain: "the-air-co.firebaseapp.com",
  projectId: "the-air-co",
  storageBucket: "the-air-co.firebasestorage.app",
  messagingSenderId: "294255515562",
  appId: "1:294255515562:web:8585815e6e17fa97cbfdd3",
  measurementId: "G-YDFVL20SJ5"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage }; 