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
const imgBtn = document.querySelector('button[title="Add image"]');
const noteImageInput = document.getElementById("noteImageInput");
onAuthStateChanged(auth, (user) => {
  if (user) {
    imgBtn.innerHTML = `<img src=${user.photoURL} alt="" width='20' height='20'> `;

    const profileImg = document.getElementById("profileImg");
    if (user.photoURL) {
      profileImg.src = user.photoURL;
    }

    console.log(user);

    // disp.innerHTML = `<p> sup ${user.displayName}</p>`;
  } else {
    window.location.href = "index.html";
    console.log("user is not signed in");
  }

  document.getElementById("signOutbtn").addEventListener("click", () => {
    alert("signing you out...");

    setTimeout(() => {
      signOut(auth)
        .then(() => {})
        .catch((error) => {
          console.log(error);
        });
    }, 1000);
  });

  // function for image

  const imgBtn = document.querySelector('button[title="Add image"]');
  const noteImageInput = document.getElementById("noteImageInput");

  imgBtn.addEventListener("click", () => {
    noteImageInput.click();
  });

  let selectedImageKey = "";
  let selectedImageDataUrl = "";

  noteImageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        selectedImageDataUrl = e.target.result; // base64 image string
        // Generate a unique key for this image
        selectedImageKey = "note-img-" + Date.now();
        // Save to localStorage
        localStorage.setItem(selectedImageKey, selectedImageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  });

  // function for adding note

  addNote.addEventListener("click", () => {
    let databaseRef = ref(database, `noteStorage/${user.uid}`);
    const date = new Date();

    let noteObject = {
      noteTitle: noteTitle.value,
      noteEntered: noteEntered.value,
      nameOfInUser: auth.currentUser.displayName,
      image: selectedImageDataUrl,

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
    displayNotes.innerHTML = "";
    if (data) {
      Object.values(data).forEach((eachNote) => {
        //  alert(eachNote.noteEntered)
        displayNotes.innerHTML += `
        <div class="card mx-1 bg-dark text-light" style="width: 18rem;">
          <div class="card-body">
            <div class="col-lg-3 col-md-4 col-sm-6" style="width: 18rem;>
                    <div class="card note-card fade-up bg-dark text-white">
                        <div class="card-body ">
                            <h6 class="card-title">${eachNote.noteTitle}</h6>
<p class="card-text">${eachNote.noteEntered}</p>
                             <small>${eachNote.time}</small>
                        </div>
                    </div>
                </div>

          </div>
                </div>
        

        
      `;
        noteEntered.value = "";
        noteTitle.value = "";
      });
    } else {
      displayNotes.innerHTML = "<p>No notes yet.</p>";
    }
  });
});
