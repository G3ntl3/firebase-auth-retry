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

// Get DOM elements
const imgBtn = document.getElementById("imgBtn");
const profileImg = document.getElementById("profileImg");
const disp = document.getElementById("disp");
const addNote = document.getElementById("addNote");
const noteTitle = document.getElementById("noteTitle");
const noteEntered = document.getElementById("noteEntered");
const displayNotes = document.getElementById("displayNotes");

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Update profile image in dropdown button
    if (user.photoURL && profileImg) {
      profileImg.src = user.photoURL;
    }

    console.log(user);

    // Add sign out event listener
    const signOutBtn = document.getElementById("signOutbtn");
    if (signOutBtn) {
      signOutBtn.addEventListener("click", () => {
        signOut(auth)
          .then(() => {
            console.log("sign out success");
            window.location.href = "index.html";
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }

    // Function for adding note
    if (addNote) {
      addNote.addEventListener("click", () => {
        // Check if both fields have content
        if (noteTitle.value.trim() === "" && noteEntered.value.trim() === "") {
          alert("Please enter a title or note content");
          return;
        }

        let databaseRef = ref(database, `noteStorage/${user.uid}`);
        const date = new Date();
        let noteObject = {
          noteTitle: noteTitle.value || "Untitled",
          noteEntered: noteEntered.value || "",
          nameOfInUser: auth.currentUser.displayName,
          time: date.toLocaleTimeString(),
          date: date.toLocaleDateString(),
        };

        push(databaseRef, noteObject);

        // Clear the input fields after adding
        noteTitle.value = "";
        noteEntered.value = "";
      });
    }

    // Listen for notes from database
    let noteref = ref(database, `noteStorage/${user.uid}`);
    onValue(noteref, (snapshot) => {
      let data = snapshot.val();
      if (displayNotes) {
        displayNotes.innerHTML = "";

        if (data) {
          Object.entries(data).forEach(([key, eachNote]) => {
            displayNotes.innerHTML += `
              <div class="col-lg-3 col-md-4 col-sm-6 mb-3">
                <div class="card note-card fade-up">
                  <div class="card-body">
                    <h6 class="card-title">${
                      eachNote.noteTitle || "Untitled"
                    }</h6>
                    <p class="card-text">${eachNote.noteEntered || ""}</p>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                      <small class="text-muted">${eachNote.time}</small>
                      <button class="btn btn-sm btn-outline-danger" onclick="deleteNote('${key}', '${
              user.uid
            }')">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            `;
          });
        } else {
          displayNotes.innerHTML = `
            <div class="col-12 text-center">
              <p class="text-muted">No notes yet. Create your first note!</p>
            </div>
          `;
        }
      }
    });
  } else {
    window.location.href = "index.html";
    console.log("user is not signed in");
  }
});

// Function to delete a note
window.deleteNote = function (noteKey, userId) {
  if (confirm("Are you sure you want to delete this note?")) {
    const noteRef = ref(database, `noteStorage/${userId}/${noteKey}`);
    set(noteRef, null);
  }
};
