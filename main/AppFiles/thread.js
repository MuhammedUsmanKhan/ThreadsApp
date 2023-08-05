import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, arrayUnion, arrayRemove, collection, addDoc, getDocs, updateDoc, orderBy, serverTimestamp, query, onSnapshot, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";

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
const storage = getStorage(app)
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
        uid: user.uid,
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
      //alert('sdfs')
      openmessageModal()
      dispmessageModel()
    }
  }
  catch (error) {
    console.log(error)
  }

})

/////////////////////////////////Displaying-Threads on Dom Load or after any Change/////////////////////////////////////
let displayThreads = () => {
  const q = query(collection(db, "threads"), orderBy("timestamp", "desc"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const threadList = document.getElementById("threadList");
    threadList.innerHTML = " "
    querySnapshot.forEach(async (doc) => {
      console.log(doc.data())
      // const docID = document.createElement(`span`)
      // docID.setAttribute(`class`, `hidden`)
      //docID.setAttribute(`id`,`id`)
      //docID.textContent = doc.id
      // Create the list item element
      const listItem = document.createElement("li");
      listItem.setAttribute("class", "bg-[#C6E2FF] rounded-lg shadow-md p-6 flex flex-col justify-between");

      // Create the first inner div
      const firstDiv = document.createElement("div");

      // Create the thread title heading element and add content
      const threadTitle = document.createElement("h2");
      threadTitle.setAttribute("class", "text-2xl text-blue-500 font-semibold mb-2");
      threadTitle.textContent = `${doc.data().threadTitle}`;

      // Create the paragraph element for the author and add content
      const authorParagraph = document.createElement("p");
      authorParagraph.setAttribute("class", "text-gray-600 text-sm");
      authorParagraph.innerHTML = `By <span class='text-blue-600'>${doc.data().userName}</span>`;

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

      const q = query(collection(db, "userDetails"));
      let totalreply = 0
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((user) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(user.id, " => ", user.data());
        if (doc.data()[user.id]) {
          console.log(doc.data()[user.id])
          let reply = doc.data()[user.id].length
          totalreply = totalreply + reply
          //console.log(reply)
          replyCountSpan.textContent = `${totalreply} replies`;
        }

      });


      // Append the SVG icon and span to the first inner div inside the second inner div
      innerDiv.appendChild(svgIcon);
      innerDiv.appendChild(replyCountSpan);

      // Create the button element
      const viewButton = document.createElement("button");
      viewButton.setAttribute("class", "text-white bg-blue-500 hover:bg-blue-600 rounded-lg px-4 py-2 text-sm font-semibold focus:outline-none");
      viewButton.setAttribute(`id`, `myViewModal`)
      viewButton.setAttribute(`ref`, doc.id)
      viewButton.addEventListener(`click`, openViewModal)
      viewButton.addEventListener(`click`, displayUserThreadInfo)
      viewButton.addEventListener(`click`, displayComm)
      viewButton.textContent = "View";

      // Append the inner div and button to the second inner div
      secondDiv.appendChild(innerDiv);
      secondDiv.appendChild(viewButton);

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
  //console.log(event.target.nextElementSibling)
  const docID = event.target.getAttribute(`ref`);
  const docRef = doc(db, "threads", docID);
  const docSnap = await getDoc(docRef);
  //const user = auth.currentUser
  const threadTitle = document.getElementById(`Title`)
  const threadContent = document.getElementById(`threadContent`)
  const docIDOnPostButton = document.getElementById(`postComment`)
  //threadContent.setAttribute(`class`,``)  
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    console.log(docSnap.data().threadTitle)
    /////////Uploading modal user image/////////////////
    let user = docSnap.data()
    console.log(user.uid)
    //console.log(userid)
    getDownloadURL(ref(storage, 'users/' + user.uid + '/profile.jpg'))
      .then((url) => {
        console.log(url)
        const img = document.getElementById('usermodalProfImg');
        img.setAttribute('src', url);
      })
      .catch((error) => {
        console.log(`image not found`)
      });
    threadTitle.textContent = docSnap.data().threadTitle
    threadContent.textContent = docSnap.data().threadContent
    docIDOnPostButton.setAttribute(`ref`, docID)
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
  // return docID
}
let commentBut = document.getElementById(`postComment`)
let commentlistContainer = document.getElementById(`commentlistContainer`)
let addComment = async (e) => {
  e.preventDefault();
  const docIDCont = e.target.getAttribute(`ref`)
  console.log(docIDCont)
  //e.target
  let user = auth.currentUser
  // console.log(user)
  //let docId = document.getElementById('id')
  //let commentsArr = []
  let threadComment = document.getElementById('threadComment')
  let comment = threadComment.value
  const docRef = doc(db, "threads", docIDCont);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists() && comment.trim().length != 0) {
    console.log("Document data:", docSnap.data());
    //    console.log(docSnap.data().hasOwnProperty(user.uid))
    if (!docSnap.data().hasOwnProperty(user.uid)) {
      const washingtonRef = doc(db, "threads", docIDCont);
      // Set the "capital" field of the city 'DC'
      console.log(washingtonRef)
      await updateDoc(washingtonRef, {
        [user.uid]: [comment]
      });
    }
    else {
      //    console.log(docSnap.data().hasOwnProperty(docIDCont))
      const washingtonRef = doc(db, "threads", docIDCont);
      // Atomically add a new region to the "regions" array field.
      await updateDoc(washingtonRef, {
        [user.uid]: arrayUnion(comment)
      });
    }
    
    const li = document.createElement("li");
    li.className = "flex justify-between w-full";

    const commentContainer = document.createElement("div");
    commentContainer.className = "flex w-11/12  space-x-2";

    const image = document.createElement("img");

    getDownloadURL(ref(storage, 'users/' + user.uid + '/profile.jpg'))
      .then((url) => {
        // `url` is the download URL for 'images/stars.jpg
        // Or inserted into an <img> element
        image.className = "h-11 w-12 sm:w-11 rounded-full";
        image.setAttribute('src', url);
        image.alt = "User Image";
      })
      .catch((error) => {
        // Handle any errors
      });

    const content = document.createElement("p");
    content.className = "border-2 text-white p-2 ";
    content.textContent = threadComment.value;
    threadComment.value = ""

    commentContainer.appendChild(image);
    commentContainer.appendChild(content);

    const actionsContainer = document.createElement("div");
    actionsContainer.className = "flex flex-col  items-center";

    const editButton = document.createElement("button");
    editButton.setAttribute(`ref`, `${docIDCont}`)
    editButton.addEventListener(`click`, editComment)
    editButton.innerHTML = '<i class="fa-regular pl-2 pr-2 text-white fa-pen-to-square"></i>';

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute(`ref`, `${docIDCont}`)
    deleteButton.addEventListener(`click`, delComment)
    deleteButton.innerHTML = '<i class="fa-regular pl-2 pr-2 text-white fa-trash-can"></i>';

    actionsContainer.appendChild(editButton);
    actionsContainer.appendChild(deleteButton);

    li.appendChild(commentContainer);
    li.appendChild(actionsContainer);

    commentlistContainer.appendChild(li)
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
    openCommentmessageModal()
    dispmessageModel()
  }
  //console.log(docIDCont.textContent)

  //user.uid will go as a ref to para and when we will display messages on load, the messages will come back to their
  //respective paras
  //ontime
}
commentBut.addEventListener(`click`, addComment)

//ondomload
let displayComm = async (event) => {

  let commentlistContainer = document.getElementById(`commentlistContainer`)

  const q = query(collection(db, "userDetails"));

  const querySnapshot = await getDocs(q);
  commentlistContainer.innerHTML = ``
  querySnapshot.forEach(async (eachdoc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(eachdoc.id, " => ", eachdoc.data());


    const docID = event.target.getAttribute(`ref`);
    const docRef = doc(db, "threads", docID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());

      if (docSnap.data()[eachdoc.id]) {

        for (let i = 0; i < docSnap.data()[eachdoc.id].length; i++) {

          console.log(docSnap.data())
          let commentlistContainer = document.getElementById(`commentlistContainer`)

          const li = document.createElement("li");
          li.className = "flex  w-full";

          const commentContainer = document.createElement("div");
          commentContainer.className = "flex w-11/12  space-x-2";

          const image = document.createElement("img");

          getDownloadURL(ref(storage, 'users/' + eachdoc.id + '/profile.jpg'))
            .then((url) => {
              // `url` is the download URL for 'images/stars.jpg
              // Or inserted into an <img> element
              image.className = "h-11 w-12 sm:w-11 rounded-full";
              image.setAttribute('src', url);
              image.alt = "User Image";
            })
            .catch((error) => {
              // Handle any errors
              image.alt = "Profile Image not Found";
            });

          const content = document.createElement("p");
          content.className = "border-2 text-white p-2 ";
          content.textContent = docSnap.data()[eachdoc.id][i];

          commentContainer.appendChild(image);
          commentContainer.appendChild(content);

          li.appendChild(commentContainer);
          let user = auth.currentUser

          console.log(user.uid)
          console.log(docSnap.data()[user.uid])
          console.log(docSnap.data()[eachdoc.id][i])
          if (typeof docSnap.data()[user.uid] != "undefined") {

            if (docSnap.data()[user.uid][i] == docSnap.data()[eachdoc.id][i]) {


              const actionsContainer = document.createElement("div");
              actionsContainer.className = "flex flex-col  items-center";

              const editButton = document.createElement("button");
              editButton.setAttribute(`ref`, `${docID}`)
              editButton.addEventListener(`click`, editComment)
              editButton.innerHTML = '<i class="fa-regular pl-2 pr-2 text-white fa-pen-to-square"></i>';

              const deleteButton = document.createElement("button");
              deleteButton.setAttribute(`ref`, `${docID}`)
              deleteButton.addEventListener(`click`, delComment)
              deleteButton.innerHTML = '<i class="fa-regular pl-2 pr-2 text-white fa-trash-can"></i>';

              actionsContainer.appendChild(editButton);
              actionsContainer.appendChild(deleteButton);

              li.appendChild(actionsContainer);

            }
          }


          commentlistContainer.appendChild(li)

        }

      }
      else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }


    }
  });




}

//////////////////////Del Comment/////////////////////////////

let delComment = async (event) => {

  const docID = event.target.parentNode.getAttribute(`ref`);
  console.log(docID)
  const commentVal = event.target.parentNode.parentNode.parentNode.childNodes[0].childNodes[1].textContent
  const delcommentLi = event.target.parentNode.parentNode.parentNode
  console.log(commentVal)
  const washingtonRef = doc(db, "threads", docID);
  let user = auth.currentUser
  console.log(user.uid)
  // Atomically remove a region from the "regions" array field.
  await updateDoc(washingtonRef, {
    [user.uid]: arrayRemove(`${commentVal}`)
  });
  delcommentLi.remove()
}

/////////////////////Edit Comment ///////////////////////////////////
let editComment = async (event) => {
  console.log(event.target)
  let editButton = event.target
  editButton.parentNode.disabled = true
  const docID = event.target.parentNode.getAttribute(`ref`);
  console.log(docID)
  let prevCommentVal = event.target.parentNode.parentNode.parentNode.childNodes[0].childNodes[1].textContent
  let prevCommentPara = event.target.parentNode.parentNode.parentNode.childNodes[0].childNodes[1]
  let commentContainer = event.target.parentNode.parentNode.parentNode.childNodes[0]
  console.log(commentContainer)
  prevCommentPara.classList.add(`hidden`)
  let inpComment = document.createElement(`input`)
  inpComment.setAttribute(`class`, `border-2 text-white p-2 bg-blue-500 outline-none w-full`)
  inpComment.value = prevCommentVal
  inpComment.setAttribute(`ref`, docID)
  inpComment.addEventListener(`keypress`, submitComment)
  commentContainer.appendChild(inpComment)

  const washingtonRef = doc(db, "threads", docID);
  let user = auth.currentUser
  console.log(user.uid)
  // Atomically remove a region from the "regions" array field.
  await updateDoc(washingtonRef, {
    [user.uid]: arrayRemove(`${prevCommentVal}`)
  });

}

let submitComment = async (event) => {

  if (event.keyCode === 13) {

    console.log("Enter key pressed!");
    //console.log(event.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[1])
    //let editBut = event.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[1]
    editBut.disabled = false
    const docID = event.target.getAttribute(`ref`);
    console.log(docID)
    let user = auth.currentUser
    let edittedComment = event.target.value
    const washingtonRef = doc(db, "threads", docID);
    // Atomically add a new region to the "regions" array field.
    await updateDoc(washingtonRef, {
      [user.uid]: arrayUnion(edittedComment)
    });
    let inpComment = event.target
    inpComment.classList.add(`hidden`)
    let para = event.target.previousSibling
    //para.classList.add(``)
    para.textContent = edittedComment
    para.classList.remove(`hidden`)
    console.log(para)
    event.preventDefault();
  }

}


const messageDisplayModal = document.getElementById('myModal');
const messagecloseModal = messageDisplayModal.getElementsByClassName('error-modal-close')[0];
const messagemodalContainer = messageDisplayModal.getElementsByClassName('error-modal-container')[0];
const messagemodalOverlay = messageDisplayModal.getElementsByClassName('error-modal-overlay')[0];
///////////////////////////////Messgae Respond Modal///////////////////////////////////

let openmessageModal =  () => {
    const modalText = document.getElementById(`Response`);
    modalText.innerText = `Fill in the required blanks to create a Post`
    //console.log(modalText.innerText)
    //console.log(error.data)
    messageDisplayModal.classList.remove('hidden');
    setTimeout(() => {
        messageDisplayModal.classList.add('modal-open');
        messagemodalContainer.classList.add('modal-container-open');
    }, 50);

}
let openCommentmessageModal =  () => {
  const modalText = document.getElementById(`Response`);
  modalText.innerText = `Fill in the required blank to add an Comment.`
  //console.log(modalText.innerText)
  //console.log(error.data)
  messageDisplayModal.classList.remove('hidden');
  setTimeout(() => {
      messageDisplayModal.classList.add('modal-open');
      messagemodalContainer.classList.add('modal-container-open');
  }, 50);

}
let dispmessageModel = () => {
    messagecloseModal.addEventListener('click', (event) => {
        event.preventDefault()
        messageDisplayModal.classList.remove('modal-open');
        messagemodalContainer.classList.remove('modal-container-open');
        setTimeout(() => {
            messageDisplayModal.classList.add('hidden');
        }, 300);
    });
    messagemodalOverlay.addEventListener('click', (event) => {
        event.preventDefault()
        messageDisplayModal.classList.remove('modal-open');
        messagemodalContainer.classList.remove('modal-container-open');
        setTimeout(() => {
            messageDisplayModal.classList.add('hidden');
        }, 300);
    });
    messagecloseModal.addEventListener('click', (event) => {
        event.preventDefault()
        messageDisplayModal.classList.remove('modal-open');
        messagemodalContainer.classList.remove('modal-container-open');
        setTimeout(() => {
            messageDisplayModal.classList.add('hidden');
        }, 300);
    });
    messagemodalOverlay.addEventListener('click', (event) => {
        event.preventDefault()
        messageDisplayModal.classList.remove('modal-open');
        messagemodalContainer.classList.remove('modal-container-open');
        setTimeout(() => {
            messageDisplayModal.classList.add('hidden');
        }, 300);
    });

}


////////////////////////Sign-Out/////////////////////////////////////

let userMenuButton = document.getElementById(`user-menu-button`)
let userMenuDropdown = document.getElementById(`userMenuDropdown`)
let signOutMenu = document.getElementById(`signOutMenu`)
// Function to toggle the menu visibility
function toggleMenu() {
  //userMenuDropdown.classList.remove('hidden')
  userMenuDropdown.classList.toggle('hidden');
}
// Event listener to open the menu when the button is clicked
userMenuButton.addEventListener('click', toggleMenu);
// Event listener to close the menu when focus is lost
document.addEventListener('click', (event) => {
  if (!userMenuDropdown.contains(event.target) && !userMenuButton.contains(event.target)) {
    userMenuDropdown.classList.add('hidden');
  }
});

// Event listener to handle clicks on menu links
userMenuDropdown.addEventListener('click', (event) => {
  if (event.target.tagName === 'A') {
    // If a link is clicked, close the menu
    userMenuDropdown.classList.add('hidden');
  }
});

signOutMenu.addEventListener(`click`, () => {
  signOut(auth).then(() => {
    // alert('succesfully signed out')
    location.href = './signin.html'
  }).catch((error) => {
    // An error happened.
  });
})

/////////////////////////////Checking-User///////////////////////////////
const CheckingUser = (user) => {
  if (user) {

    console.log('User is logged in:', user.email);
    console.log(user.uid)
    getDownloadURL(ref(storage, 'users/' + user.uid + '/profile.jpg'))
      .then((url) => {
        // `url` is the download URL for 'images/stars.jpg
        // Or inserted into an <img> element
        const img = document.getElementById('userProfImg');
        img.setAttribute('src', url);
      })
      .catch((error) => {
        // Handle any errors
      });


  } else {

    console.log('User is logged out');
    location.href = `./signin.html`;

  }
};

onAuthStateChanged(auth, CheckingUser)




