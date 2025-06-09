// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  TwitterAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";


//  Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVCK7rmjGe8PAU_FA87Hn6Nrs9h8yxXXI",
  authDomain: "fire-base-auth-retry.firebaseapp.com",
  projectId: "fire-base-auth-retry",
  storageBucket: "fire-base-auth-retry.firebasestorage.app",
  messagingSenderId: "137253456012",
  appId: "1:137253456012:web:e5aa0ea201fc42e30013a9",
};
// Toastify for error handling dynamically
const toast = (text, destination, bgColor, textColor) => {
  Toastify({
    text: text,
    duration: 2000,
    destination: destination,

    close: true,
    gravity: "top", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: bgColor,
      color: textColor,
    },
    onClick: function () {}, // Callback after click
  }).showToast();
};
  

// Global variables and firebase init
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const twitterProvider = new TwitterAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const Githubprovider = new GithubAuthProvider();
const auth = getAuth();

// Google signin btn
document.getElementById("signIn").addEventListener("click", () => {
  provider.setCustomParameters({
    prompt: "select_account",
  });
  signInWithPopup(auth, provider)
    .then((response) => {

      window.location.href = "./dashboard.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode == "auth/popup-blocked") {
        toast("Browser is preventing popup", "", "red", "white");

      }
      else if (errorCode == "auth/cancelled-popup-request") {
        toast("Cancelled pop up request", "", "red", "white");
      }
      else if (errorCode == "auth/popup-closed-by-user") {
        toast("Pop up cancelled", "", "red", "white");
      }
    
        console.log(error);
    });
});

// twitter log in btn/ /
signInX.addEventListener("click", () => {
  twitterProvider.setCustomParameters({
    prompt: "select_account",
  });
  signInWithPopup(auth, twitterProvider)
    .then((result) => {
      // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
      // You can use these server side with your app's credentials to access the Twitter API.
      const credential = TwitterAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const secret = credential.secret;

      // The signed-in user info.
      const user = result.user;
      console.log(user);
      
      alert("Sign up successful!");
     
 setTimeout(() => {
      window.location.href = "./dashboard.html";
        
    }, 1000)
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
     

      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = TwitterAuthProvider.credentialFromError(error);
      if (errorCode == "auth/popup-blocked") {
        toast("Browser is preventing popup", "", "red", "white");
      } else if (errorCode == "auth/cancelled-popup-request") {
        toast("Pop up cancellled ", "", "red", "white");
      }
      // ...
    });

   
});

// facebook signin



signInGithub.addEventListener("click", () => {
  GithubProvider.setCustomParameters({
    prompt: "select_account",
  });
  signInWithPopup(auth, Githubprovider)
    .then((result) => {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      console.log(token);
      console.log(credential);
      // The signed-in user info.
      const user = result.user;
        console.log(user);
      alert("Sign up successful!");
        
 setTimeout(() => {
      window.location.href = "./dashboard.html";
    }, 1000);
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GithubAuthProvider.credentialFromError(error);
      // ...

      if (errorCode == "auth/popup-blocked") {
        toast("Browser is preventing popup", "", "red", "white");
      } else if (errorCode == "auth/cancelled-popup-request") {
        toast("Pop up cancellled ", "", "red", "white");
      }
    });
  
   
});

// sign in with email and password

submitDetails.addEventListener("click", () => {
  event.preventDefault();

  const email = document.getElementById("userEmail").value;
  const userPassword = document.getElementById("userPassword").value;
  signInWithEmailAndPassword(auth, email, userPassword)
    .then((userCredential) => {
      // Signed up
      // alert("Sign up successful!");
      toast("Log in successful", "green", "white");

 console.log(userCredential);
 
        setTimeout(() => {

            window.location.href='./dashboard.html'
        }, 1000);
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
   console.log(errorMessage);

      if (errorCode == "auth/invalid-email") {
        toast("Enter a valid email 🤷‍♂️", "", "red", "white");
      } else if (errorCode == "user-not-found") {
        toast(
          "User not found, Click to proceed to sign upn",
          "https://firebase-auth-retry.vercel.app/index.html",
          "grey",
          "white"
        );
      } else if (errorCode == "auth/wrong-password") {
        toast("Enter correct password🤷‍♂️", "", "red", "white");
      } else if (errorCode == "auth/missing-password") {
        toast("Missing password🤷‍♂️", "", "red", "white");
      } else if (errorCode == "auth/popup-blocked") {
        toast("Browser is preventing popup", "", "red", "white");
      } else if (errorCode == "auth/cancelled-popup-request") {
        toast("Pop up cancellled ", "", "red", "white");
      }

      

      // ..
    });
});
