import {
  initializeApp,
  getApps,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCVCK7rmjGe8PAU_FA87Hn6Nrs9h8yxXXI",
  authDomain: "fire-base-auth-retry.firebaseapp.com",
  projectId: "fire-base-auth-retry",
  storageBucket: "fire-base-auth-retry.firebasestorage.app",
  messagingSenderId: "137253456012",
  appId: "1:137253456012:web:e5aa0ea201fc42e30013a9",
  databaseURL: "https://fire-base-auth-retry-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth();
const database = getDatabase(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    disp.innerHTML = `<p> sup ${user.displayName}</p>`;
  } else {
    window.location.href = "index.html";
    console.log("user is not signed in");
  }

  signOutbtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        console.log("sign out success");
      })
      .catch((error) => {
        console.log(error);
      });
  });

  // function for adding note

  addNote.addEventListener("click", () => {
    let databaseRef = ref(database, `noteStorage/${user.uid}`);
    const date = new Date();
    let noteObject = {
      noteTitle:noteTitle.value,
      noteEntered: noteEntered.value,
      nameOfInUser: auth.currentUser.displayName,
      time: date.toLocaleTimeString(),
    };
    push(databaseRef, noteObject);
    // display info from the databse

    // alert(noteEntered.value)

    // noteEntered.value = " ";
    // <img src="..." class="card-img-top" alt="...">
  });
  let noteref = ref(database, `noteStorage/${user.uid}`);
  onValue(noteref, (snapshot) => {
    let data = snapshot.val();
    displayNotes.innerHTML = ""; // Clear previous notes
    if (data) {
      Object.values(data).forEach((eachNote) => {
        displayNotes.innerHTML += `
        <div class="card" style="width: 18rem;">
          <div class="card-body">
            <h1>${eachNote.nameOfInUser}</h1>
<button class="bg-primary">Edit</button>

<button class="bg-danger">Delete</button>
            
            <p class="card-text">${eachNote.noteEntered}</p>
            <small>${eachNote.time}</small>
          </div>
        </div>
      `;
      });
    } else {
      displayNotes.innerHTML = "<p>No notes yet.</p>";
    }
  });
});