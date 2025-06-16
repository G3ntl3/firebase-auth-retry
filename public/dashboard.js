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

      // Show image preview
      const imagePreview = document.getElementById("imagePreview");
      const selectedImage = document.getElementById("selectedImage");
      selectedImage.src = selectedImageDataUrl;
      imagePreview.style.display = "block";
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
        });
    }, 500);
  });

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
        //  display my note in the dashboard
        displayNotes.innerHTML += `
<div class="card mx-1 bg-dark text-light note-card" style="width: 18rem;">
  <div class="card-body">
    ${imgTag}
    <h6 class="card-title">${eachNote.noteTitle}</h6>
    <p class="card-text">${eachNote.noteEntered}</p>
    <small>${eachNote.time}</small>
    <div class="d-flex gap-2 mt-2">
      <button class="btn btn-sm btn-outline-light edit-note-btn" data-key="${key}">
        <i class="fas fa-edit mx-1"></i> <i class="fas fa-trash"></i>
      </button>
     
    </div>
  </div>
</div>
`;
      });

      // Add edit button listeners
      document.querySelectorAll(".edit-note-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const noteKey = this.getAttribute("data-key");
          currentNoteData = {
            ...data[noteKey],
            key: noteKey,
          };

          // Fill modal with note data
          document.getElementById("editNoteTitle").value =
            currentNoteData.noteTitle;
          document.getElementById("editNoteEntered").value =
            currentNoteData.noteEntered;

          // Show modal
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
    if (!currentNoteData) return;

    const noteRef = ref(
      database,
      `noteStorage/${auth.currentUser.uid}/${currentNoteData.key}`
    );
    const updatedNote = {
      ...currentNoteData,
      noteTitle: document.getElementById("editNoteTitle").value,
      noteEntered: document.getElementById("editNoteEntered").value,
      time: new Date().toLocaleTimeString(),
    };

    set(noteRef, updatedNote).then(() => {
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("editNoteModal")
      );
      modal.hide();
    });
  });

  //  function to Delete note
  document
    .getElementById("deleteNoteBtn")
    .addEventListener("click", function () {
      if (!currentNoteData) return;

      const noteRef = ref(
        database,
        `noteStorage/${auth.currentUser.uid}/${currentNoteData.key}`
      );
      remove(noteRef).then(() => {
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("editNoteModal")
        );
        modal.hide();
      });
    });

  // Add search functionality after notes are rendered
  const searchInputs = document.querySelectorAll('input[type="search"]');
  searchInputs.forEach((input) => {
    input.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      const noteCards = document.querySelectorAll(".note-card");

      noteCards.forEach((card) => {
        const title =
          card.querySelector(".card-title")?.textContent.toLowerCase() || "";
        const content =
          card.querySelector(".card-text")?.textContent.toLowerCase() || "";

        if (title.includes(searchTerm) || content.includes(searchTerm)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
});
