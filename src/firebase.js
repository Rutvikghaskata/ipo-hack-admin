import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDo9yQ0LK-928CjCUugLu-8QV2TVx__ZY8",
  authDomain: "risinginfostarter.firebaseapp.com",
  databaseURL:
    "https://risinginfostarter-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "risinginfostarter",
  storageBucket: "risinginfostarter.appspot.com",
  messagingSenderId: "928773824302",
  appId: "1:928773824302:web:10907d6b88dd1cd812e4bf",
  measurementId: "G-2QC4YDS781",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const analytics = getAnalytics(app);

export { db, auth, analytics };
