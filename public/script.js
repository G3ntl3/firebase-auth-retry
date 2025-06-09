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
      createUserWithEmailAndPassword
    } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

// Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyCVCK7rmjGe8PAU_FA87Hn6Nrs9h8yxXXI",
      authDomain: "fire-base-auth-retry.firebaseapp.com",
      projectId: "fire-base-auth-retry",
      storageBucket: "fire-base-auth-retry.firebasestorage.app",
      messagingSenderId: "137253456012",
      appId: "1:137253456012:web:e5aa0ea201fc42e30013a9",
    };

    // Global variables 
    const app = initializeApp(firebaseConfig);
    const provider = new GoogleAuthProvider();
    const twitterProvider = new TwitterAuthProvider();
    const facebookProvider = new FacebookAuthProvider();
    const Githubprovider = new GithubAuthProvider()
const auth = getAuth();
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    

// error handling with toastify 
// dynamically handle error with toastify
const toast = (text, destination,bgColor,textColor) => {
  
Toastify({
  text: text,
  duration: 3000,
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
}



    // Google signin btn
document.getElementById("signIn").addEventListener("click", () => {
  provider.setCustomParameters({
    prompt: "select_account",
  });
      signInWithPopup(auth, provider)
        .then((response) => {

          console.log(response);
          toast("Sign in with Google successful✔️", "", "green", "white");
          setTimeout(() => {
            window.location.href = "./dashboard.html";
          }, 1500);
        })
        .catch((error) => {
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
          toast("Sign in with Twitter successful✔️", "", "green", "white");
          setTimeout(() => {
            window.location.href = "./dashboard.html";
          }, 1500);

          // IdP data available using getAdditionalUserInfo(result)
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);

          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = TwitterAuthProvider.credentialFromError(error);
          // ...
        });
    });


    // facebook signin 



signInGithub.addEventListener('click', ()=>{
  Githubprovider.setCustomParameters({
    prompt: "select_account",
  });
  signInWithPopup(auth, Githubprovider)
  .then((result) => {
    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    toast("Sign in with Github successful✔️", "", "green", "white");
    setTimeout(() => {
      window.location.href = "./dashboard.html";
    }, 1500);
    
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GithubAuthProvider.credentialFromError(error);
    // ...
  });



})


// sign in with email and password

// use regex for password validation
const checkforValidPassword = (password) => {
  return passwordRegex.test(password);
};  


submitDetails.addEventListener('click', () => {
    event.preventDefault()
    const email = document.getElementById('userEmail').value 
  const userPassword = document.getElementById('userPassword').value
  
  
  if (!checkforValidPassword(userPassword)) {
    toast(
      "Password must have at least 8 characters, including uppercase, lowercase and numbers",
      "red",
      "white"
    );
    return;
  }

    createUserWithEmailAndPassword(auth, email, userPassword)
    .then((userCredential) => {
        // Signed up
        toast("successful", "green", "white");
      
      setTimeout(() =>
      {
        window.location.href='./logIn.html'
      }, 1000)
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      
      if (errorCode == "auth/invalid-email") {
        toast("Enter a valid email 🤷‍♂️", "red", "white");
      } else if (errorCode == "auth/missing-password") {
        toast("Passsword cannot be blank", "red", "white");
      } else if (errorCode == "auth/missing-email") {
        toast("Email cannot be blank", "red", "white");
      } else if (errorCode == "auth/weak-password") {
        toast("Enter a strong passsword", "yellow", "white");
      } else if (errorCode == "auth/email-already-in-use") {
        toast(
          "Email already in use, proceed to log in page",
          "grey",
          "white"
        );
      } else if (errorCode == "auth/network-request-failed") {
        toast(
          "Network issue! Don't fret, check your connectivity and refresh 👌",
          "yellow",
          "white"
        );
      }
       else if (errorCode == "auth/internal-error") {
         toast(
           "Something went wrong refresh 👌",
           "yellow",
           "white"
         );
       }
        
      console.log(errorCode);
      
      // ..
    })

})