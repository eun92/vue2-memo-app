// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDN7GKGEWTqu-kRny-gWmRcrYSyEzNDCM0",
  authDomain: "vue2-memo-app.firebaseapp.com",
  databaseURL: "https://vue2-memo-app-default-rtdb.firebaseio.com",
  projectId: "vue2-memo-app",
  storageBucket: "vue2-memo-app.appspot.com",
  messagingSenderId: "1092065156726",
  appId: "1:1092065156726:web:1105e724aced495c5ec957",
  measurementId: "G-HZ7MGC0QN7",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
