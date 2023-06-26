import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";

import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDdxr341P76gNC3wU9fRUKxkT4uxADcnOU",
  authDomain: "prueba-4cb09.firebaseapp.com",
  projectId: "prueba-4cb09",
  storageBucket: "prueba-4cb09.appspot.com",
  messagingSenderId: "256672207531",
  appId: "1:256672207531:web:fa541d9daecbb8a7dfddee",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
