import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 1. Initialize the Firebase App Singleton
// This checks if an app already exists to prevent Next.js hot-reload crashes,
// while ensuring it initializes correctly on both Server (SSR/Build) and Client.
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 2. Initialize Core Services
const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);

export { app, db, auth };
