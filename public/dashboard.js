import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCVCK7rmjGe8PAU_FA87Hn6Nrs9h8yxXXI",
  authDomain: "fire-base-auth-retry.firebaseapp.com",
  projectId: "fire-base-auth-retry",
  storageBucket: "fire-base-auth-retry.firebasestorage.app",
  messagingSenderId: "137253456012",
  appId: "1:137253456012:web:e5aa0ea201fc42e30013a9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user) {
    disp.innerHTML = `<p> sup ${user.displayName}</p>`;


  } else {
    window.location.href = "index.html";
    console.log("user is not signed in");
  }
});

signOutbtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("sign out success");
    })
    .catch((error) => {
      console.log(error);
    });
});


addNote.addEventListener('click', () => {
  alert(noteEntered.value)




})
