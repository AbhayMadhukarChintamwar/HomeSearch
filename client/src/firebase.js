
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "homesearch-dc5ad.firebaseapp.com",
  projectId: "homesearch-dc5ad",
  storageBucket: "homesearch-dc5ad.appspot.com",
  messagingSenderId: "453111104120",
  appId: "1:453111104120:web:d845b6cc675bed0556238d"
}; 

export const app = initializeApp(firebaseConfig);