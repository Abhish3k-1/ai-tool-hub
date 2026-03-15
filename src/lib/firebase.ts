import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

function envOrDefault(envValue: string | undefined, fallback: string) {
  // Ignore template placeholders like "your_api_key" and use stable fallback.
  if (!envValue || envValue.startsWith("your_")) return fallback;
  return envValue;
}

const firebaseConfig = {
  apiKey: envOrDefault(process.env.NEXT_PUBLIC_FIREBASE_API_KEY, "AIzaSyBgFkr-zXG_sMtDCban4-xaA6o92b0slKo"),
  authDomain: envOrDefault(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, "ai-tools-hub-a467e.firebaseapp.com"),
  projectId: envOrDefault(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, "ai-tools-hub-a467e"),
  // appspot.com is the most compatible bucket format for Firebase JS SDK apps.
  storageBucket: envOrDefault(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, "ai-tools-hub-a467e.appspot.com"),
  messagingSenderId: envOrDefault(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, "680434096440"),
  appId: envOrDefault(process.env.NEXT_PUBLIC_FIREBASE_APP_ID, "1:680434096440:web:2b43875bce4e1eb9d849cd"),
  measurementId: "G-22XHYJZWK4",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
const db = getFirestore(app);

export { app, auth, provider, db };
