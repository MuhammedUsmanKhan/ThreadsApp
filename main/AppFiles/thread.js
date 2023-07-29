import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, collection, addDoc , getDocs, updateDoc , orderBy, serverTimestamp, query, onSnapshot, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyClpo8swwA_PSFRGYDqOgWkVRwPjloDt5c",
  authDomain: "threadapp-3129d.firebaseapp.com",
  projectId: "threadapp-3129d",
  storageBucket: "threadapp-3129d.appspot.com",
  messagingSenderId: "902832742728",
  appId: "1:902832742728:web:c80c2d85e2921748a5937d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
//const userss = auth.currentUser;
//console.log(userss)
//console.log(userss.currentUser.email)
////////////////////////////Create Post Modal/////////////////////////////////////////////////
const addpollBut = document.getElementById('openModal');
const modal = document.getElementById('createPollModal');
const closeModal = modal.getElementsByClassName('createPoll-modal-close')[0];
const modalContainer = modal.getElementsByClassName('createPoll-modal-container')[0];
const modalOverlay = modal.getElementsByClassName('createPoll-modal-overlay')[0];
addpollBut.addEventListener('click', () => {
  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.add('modal-open');
    modalContainer.classList.add('modal-container-open');
  }, 50);
});
closeModal.addEventListener('click', () => {
  modal.classList.remove('modal-open');
  modalContainer.classList.remove('modal-container-open');
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 300);
});
modalOverlay.addEventListener('click', () => {
  modal.classList.remove('modal-open');
  modalContainer.classList.remove('modal-container-open');
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 300);
});

let threadTitleInp = document.getElementById(`threadTitle`)
let textArea = document.getElementById(`textArea`)
let threadCreateBut = document.getElementById(`pollCreatedBut`)

////////////////////////////////////////Adding Post in Dom//////////////////////////////////////////
threadCreateBut.addEventListener(`click`, async () => {
  // Add a new document in collection "cities"
  // const userData = JSON.parse(localStorage.getItem(`userData`))
  // console.log(userData)
  const user = auth.currentUser;
  let userName;

  const q = query(collection(db, "userDetails"));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  console.log(doc.data().userName)
    if (user.email == doc.data().userEmail) {
      console.log(doc.data().userName)
       userName = doc.data().userName
       console.log(userName)
    }
  console.log(userName)
  })

  console.log(user.email)
  //for (let i = 0; i < userData.length; i++) {
    
  //}
  console.log(user)
  try {
    if (threadTitleInp.value.trim().length != 0 && textArea.value.trim().length != 0) {
      const docRef = await addDoc(collection(db, "threads"), {
        threadTitle: threadTitleInp.value,
        threadContent: textArea.value,
        userName: userName,
        userID: user.uid,
        userEmail: user.email,
        timestamp: serverTimestamp(),
      });
      console.log("Document written with ID: ", docRef.id);

      threadTitleInp.value = ""
      textArea.value = ""
      modal.classList.remove('modal-open');
      modalContainer.classList.remove('modal-container-open');
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 300);
    }
    else {
      alert("Error : Fill all the Blanks")
    }
  }
  catch (error) {
    console.log(error)
  }

})

/////////////////////////////////Displaying-Threads on Dom Load or after any Change/////////////////////////////////////
let displayThreads = () => {
  const q = query(collection(db, "threads"),orderBy("timestamp", "desc"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const threadList = document.getElementById("threadList");
    threadList.innerHTML = " "
    querySnapshot.forEach((doc) => {
      console.log(doc.data())
      const docID = document.createElement(`span`)
      docID.setAttribute(`class`, `hidden`)
      //docID.setAttribute(`id`,`id`)
      docID.textContent = doc.id
      // Create the list item element
      const listItem = document.createElement("li");
      listItem.setAttribute("class", "bg-white rounded-lg shadow-md p-6 flex flex-col justify-between");

      // Create the first inner div
      const firstDiv = document.createElement("div");

      // Create the thread title heading element and add content
      const threadTitle = document.createElement("h2");
      threadTitle.setAttribute("class", "text-2xl font-semibold mb-2");
      threadTitle.textContent = `${doc.data().threadTitle}`;

      // Create the paragraph element for the author and add content
      const authorParagraph = document.createElement("p");
      authorParagraph.setAttribute("class", "text-gray-600 text-sm");
      authorParagraph.innerHTML = `By <span class='text-indigo-600'>${doc.data().userName}</span>`;

      // Append the heading and paragraph to the first inner div
      firstDiv.appendChild(threadTitle);
      firstDiv.appendChild(authorParagraph);

      // Create the second inner div
      const secondDiv = document.createElement("div");
      secondDiv.setAttribute("class", "flex justify-between items-center mt-4");

      // Create the first inner div inside the second inner div
      const innerDiv = document.createElement("div");
      innerDiv.setAttribute("class", "flex items-center");

      // Create the SVG icon element
      const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svgIcon.setAttribute("class", "h-5 w-5 text-gray-600 mr-1");
      svgIcon.setAttribute("fill", "none");
      svgIcon.setAttribute("stroke", "currentColor");
      svgIcon.setAttribute("viewBox", "0 0 24 24");
      svgIcon.innerHTML = "<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' /><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 21v-1a7 7 0 00-7-7H8a7 7 0 00-7 7v1' /><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 6v2m0 8v.01' />";

      // Create the span element for the reply count and add content
      const replyCountSpan = document.createElement("span");
      replyCountSpan.setAttribute("class", "text-sm text-gray-600");
      replyCountSpan.textContent = "12 replies";

      // Append the SVG icon and span to the first inner div inside the second inner div
      innerDiv.appendChild(svgIcon);
      innerDiv.appendChild(replyCountSpan);

      // Create the button element
      const viewButton = document.createElement("button");
      viewButton.setAttribute("class", "text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg px-4 py-2 text-sm font-semibold focus:outline-none");
      viewButton.setAttribute(`id`, `myViewModal`)
      viewButton.addEventListener(`click`, openViewModal)
      viewButton.addEventListener(`click`, displayUserThreadInfo)
      viewButton.textContent = "View";

      // Append the inner div and button to the second inner div
      secondDiv.appendChild(innerDiv);
      secondDiv.append(viewButton, docID);

      // Append both inner divs to the list item
      listItem.appendChild(firstDiv);
      listItem.appendChild(secondDiv);

      // Append the list item to the thread list
      threadList.appendChild(listItem);
    });
    //console.log("Current cities in CA: ", cities.join(", "));
  });
}
document.addEventListener("DOMContentLoaded", displayThreads)
//=======================View-Modal==========================//
const viewModal = document.getElementById('myViewModal');
const viewCloseModal = viewModal.getElementsByClassName('view-Modal-close')[0];
const viewModalContainer = viewModal.getElementsByClassName('view-Modal-container')[0];
const viewModalOverlay = viewModal.getElementsByClassName('view-Modal-overlay')[0];

let openViewModal = () => {
  viewModal.classList.remove('hidden');
  setTimeout(() => {
    viewModal.classList.add('modal-open');
    viewModalContainer.classList.add('modal-container-open');
  }, 50);
}
viewCloseModal.addEventListener('click', () => {
  viewModal.classList.remove('modal-open');
  viewModalContainer.classList.remove('modal-container-open');
  setTimeout(() => {
    viewModal.classList.add('hidden');
  }, 300);
});
viewModalOverlay.addEventListener('click', () => {
  viewModal.classList.remove('modal-open');
  viewModalContainer.classList.remove('modal-container-open');
  setTimeout(() => {
    viewModal.classList.add('hidden');
  }, 300);
});
let displayUserThreadInfo = async (event) => {
  event.preventDefault()
  console.log(event.target.nextElementSibling)
  const docID = event.target.nextElementSibling.textContent;
  const docRef = doc(db, "threads", docID);
  const docSnap = await getDoc(docRef);
  const threadTitle = document.getElementById(`Title`)
  const threadContent = document.getElementById(`threadContent`)
  const docIDCont = document.getElementById(`docIDCont`)
  //threadContent.setAttribute(`class`,``)  
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    console.log(docSnap.data().threadTitle)
    threadTitle.textContent = docSnap.data().threadTitle
    threadContent.textContent = docSnap.data().threadContent
    docIDCont.textContent = docID
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
 // return docID
}
let commentBut = document.getElementById(`postComment`)
let addComment = async (e) =>{
  e.preventDefault();
  const docIDCont = document.getElementById(`docIDCont`)

  //e.target
  let user = auth.currentUser
  // console.log(user)
  //let docId = document.getElementById('id')
  let threadComment = document.getElementById('threadComment')
  console.log(docIDCont.textContent)
  const washingtonRef = doc(db, "threads", docIDCont.textContent);
// Set the "capital" field of the city 'DC'
await updateDoc(washingtonRef, {
  [user.uid]: threadComment.value
});
}
commentBut.addEventListener(`click`, addComment)
 
////////////////////////Sign-Out/////////////////////////////////////

let userMenuButton = document.getElementById(`user-menu-button`)
let userMenuDropDown = document.getElementById(`userMenuDropdown`)
userMenuButton.addEventListener(`click`, (event) => {
  event.preventDefault()
  userMenuDropDown.classList.remove(`hidden`)
})
let signOutMenu = document.getElementById(`signOutMenu`)
signOutMenu.addEventListener(`click`, () => {
  signOut(auth).then(() => {
    alert('succesfully signed out')
    location.href = './signin.html'
  }).catch((error) => {
    // An error happened.
  });
})

/////////////////////////////Checking-User///////////////////////////////
const CheckingUser = (user) => {
  if (user) {
    
    console.log('User is logged in:', user.email);

  } else {
  
    console.log('User is logged out');
    location.href = `./signin.html`;

  }
};

onAuthStateChanged(auth, CheckingUser)




