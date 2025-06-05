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
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
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
    const provider = new GoogleAuthProvider();
    const twitterProvider = new TwitterAuthProvider();
    const facebookProvider = new FacebookAuthProvider();
    const Githubprovider = new GithubAuthProvider()
    const auth = getAuth();

    // Google signin btn
    document.getElementById("signIn").addEventListener("click", () => {
      signInWithPopup(auth, provider)
        .then((response) => {
          disp.innerHTML = `
  <img src='${response.user.photoURL}' alt="">
  <p>welcome ${response.user.displayName} your email is ${response.user.email}</p>
  
  `;

          sendEmailVerification(auth.currentUser)
            .then(() => {
              console.log("successful");
            })
            .catch((err) => {
              console.log(err);
            });

          console.log(response);
          window.location.href = "dashboard.html";
        })
        .catch((error) => {
          console.log(error);
        });
    });

    signInX.addEventListener("click", () => {
      // twitter log in btn/ /
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

    signInFacebook.addEventListener('click', ()=>{




    signInWithPopup(auth, provider)
  .then((result) => {
    // The signed-in user info.
    const user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;

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
    const credential = FacebookAuthProvider.credentialFromError(error);

    // ...
  });
})


signInGithub.addEventListener('click', ()=>{

  signInWithPopup(auth, Githubprovider)
  .then((result) => {
    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
  
    
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


submitDetails.addEventListener('click', () => {
    event.preventDefault()
    const email = document.getElementById('userEmail').value 
    const userPassword=document.getElementById('userPassword').value
    createUserWithEmailAndPassword(auth, email, userPassword)
    .then((userCredential) => {
        // Signed up
        alert("Sign up successful!");
      alert(0)
      
      setTimeout(() =>
      {
        window.location.href='./logIn.html'
      }, 2000)
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      // ..
    })

})