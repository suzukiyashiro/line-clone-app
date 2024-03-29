import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCGXB0QAxH4pGZwIzKMv-AonhtmPYaCy8M",
  authDomain: "line-clone-app-b80d8.firebaseapp.com",
  projectId: "line-clone-app-b80d8",
  storageBucket: "line-clone-app-b80d8.appspot.com",
  messagingSenderId: "625248172827",
  appId: "1:625248172827:web:36c62515d04c875a6b71be",
  measurementId: "G-HFFR9QSJSQ",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

