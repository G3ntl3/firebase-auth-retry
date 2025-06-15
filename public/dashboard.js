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
  push,
  onValue,
  set,
  remove,
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
// ...existing imports and Firebase config...

const imgBtn = document.querySelector('button[title="Add image"]');
const noteImageInput = document.getElementById("noteImageInput");
const addNote = document.getElementById("addNote");
const noteTitle = document.getElementById("noteTitle");
const noteEntered = document.getElementById("noteEntered");
const displayNotes = document.getElementById("displayNotes");

let selectedImageKey = "";
let selectedImageDataUrl = "";

// New variable to store current note data for editing
let currentNoteData = null;

// Open file picker on image button click
imgBtn.addEventListener("click", () => {
  noteImageInput.click();
});

// Handle image selection and store data in variables
noteImageInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      selectedImageDataUrl = e.target.result;
      selectedImageKey = "note-img-" + Date.now();
      // Do NOT save to localStorage here!
    };
    reader.readAsDataURL(file);
  }
});

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  // Profile image (optional)
  const profileImg = document.getElementById("profileImg");
  if (profileImg && user.photoURL) {
    profileImg.src = user.photoURL;
  }

  document.getElementById("signOutbtn").addEventListener("click", () => {
    alert("signing you out...");
    setTimeout(() => {
      signOut(auth)
        .then(() => {})
        .catch((error) => {
          console.log(error);

  // Add note
  addNote.addEventListener("click", () => {
    if (!noteTitle.value.trim() && !noteEntered.value.trim()) {
      alert("Please enter a note title or content!");
      return;
    }
    let databaseRef = ref(database, `noteStorage/${user.uid}`);
    const date = new Date();

    // Save image to localStorage only if there is an image
    if (selectedImageKey && selectedImageDataUrl) {
      localStorage.setItem(selectedImageKey, selectedImageDataUrl);
    }

    let noteObject = {
      noteTitle: noteTitle.value,
      noteEntered: noteEntered.value,
      nameOfInUser: user.displayName,
      imageKey: selectedImageKey, // Save only the key
      time: date.toLocaleTimeString(),
    };
    push(databaseRef, noteObject);

    // Reset for next note
    selectedImageKey = "";
    selectedImageDataUrl = "";
    noteEntered.value = "";
    noteTitle.value = "";
    noteImageInput.value = "";
  });

  // Display notes
  let noteref = ref(database, `noteStorage/${user.uid}`);
  onValue(noteref, (snapshot) => {
    let data = snapshot.val();
    displayNotes.innerHTML = "";
    if (data) {
      Object.entries(data).forEach(([key, eachNote]) => {
        let imgTag = "";
        if (eachNote.imageKey) {
          const imgData = localStorage.getItem(eachNote.imageKey);
          if (imgData) {
            imgTag = `<img src="${imgData}" class="card-img-top" style="max-height:120px;object-fit:cover;">`;
          }
        }
        displayNotes.innerHTML += `
          <div class="card mx-1 bg-dark text-light" style="width: 18rem;">
            <div class="card-body">
              ${imgTag}
              <h6 class="card-title">${eachNote.noteTitle}</h6>
              <p class="card-text">${eachNote.noteEntered}</p>
              <small>${eachNote.time}</small>
                      <button class="btn btn-sm btn-outline-light edit-note-btn mt-2" data-key="${key}">Edit</button>

            </div>
          </div>
        `;
      });

      // Add event listeners AFTER rendering all notes
      document.querySelectorAll(".edit-note-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const noteKey = this.getAttribute("data-key");
          const note = data[noteKey];
          document.getElementById("editNoteTitle").value = note.noteTitle;
          document.getElementById("editNoteEntered").value = note.noteEntered;
          document
            .getElementById("saveEditBtn")
            .setAttribute("data-key", noteKey);
          document
            .getElementById("deleteNoteBtn")
            .setAttribute("data-key", noteKey);
          const modal = new bootstrap.Modal(
            document.getElementById("editNoteModal")
          );
          modal.show();
        });
      });
    } else {
      displayNotes.innerHTML = "<p>No notes yet.</p>";
    }
  });

  // Save changes
  document.getElementById("saveEditBtn").addEventListener("click", function () {
    const noteKey = this.getAttribute("data-key");
    const newTitle = document.getElementById("editNoteTitle").value;
    const newContent = document.getElementById("editNoteEntered").value;
    const noteRef = ref(
      database,
      `noteStorage/${auth.currentUser.uid}/${noteKey}`
    );

    set(noteRef, {
      ...data[noteKey],
      noteTitle: newTitle,
      noteEntered: newContent,
    });

    bootstrap.Modal.getInstance(
      document.getElementById("editNoteModal")
    ).hide();
  });

  // Delete note
  document
    .getElementById("deleteNoteBtn")
    .addEventListener("click", function () {
      const noteKey = this.getAttribute("data-key");
      const noteRef = ref(
        database,
        `noteStorage/${auth.currentUser.uid}/${noteKey}`
      );
      remove(noteRef);
      bootstrap.Modal.getInstance(
        document.getElementById("editNoteModal")
      ).hide();
    });
});
