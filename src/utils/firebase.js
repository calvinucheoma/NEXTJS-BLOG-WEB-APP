// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE,
  authDomain: 'chuksblog-52a69.firebaseapp.com',
  projectId: 'chuksblog-52a69',
  storageBucket: 'chuksblog-52a69.appspot.com',
  messagingSenderId: '205501134743',
  appId: '1:205501134743:web:b31597a59baeda4f9d76d2',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
