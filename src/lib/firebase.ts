import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBgFkr-zXG_sMtDCban4-xaA6o92b0slKo",
  authDomain: "ai-tools-hub-a467e.firebaseapp.com",
  projectId: "ai-tools-hub-a467e",
  storageBucket: "ai-tools-hub-a467e.appspot.com",
  messagingSenderId: "680434096440",
  appId: "1:680434096440:web:2b43875bce4e1eb9d849cd",
  measurementId: "G-22XHYJZWK4"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { app, auth, provider, db };