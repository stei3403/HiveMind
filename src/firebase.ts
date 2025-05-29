import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBczEBFbbq2jMeN3ipLGfQ8UrRzjFZ4fhs",
  authDomain: "hivemindapp-f1ac8.firebaseapp.com",
  projectId: "hivemindapp-f1ac8",
  storageBucket: "hivemindapp-f1ac8.firebasestorage.app",
  messagingSenderId: "275837045385",
  appId: "1:275837045385:web:c1806e0e7dd6d4cb0f9458",
  measurementId: "G-Z2DQHP6H4J"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
