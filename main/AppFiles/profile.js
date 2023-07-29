import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, collection, getDocs, updateDoc, setDoc, addDoc, orderBy, serverTimestamp, query, onSnapshot, where, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


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
//console.log(auth)
const user = auth.currentUser

let profileUser = document.getElementById(`userName`)

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


let viewPostDetails = async (event) => {
    event.preventDefault()
    console.log(event.target.getAttribute(`ref`))
    let refDocID = event.target.getAttribute(`ref`)
    let Title = document.getElementById(`Title`)
    let threadContent = document.getElementById(`threadContent`)
    const docRef = doc(db, "threads", refDocID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        Title.textContent = docSnap.data().threadTitle
        threadContent.textContent = docSnap.data().threadContent
    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }
}

//////////////////////Bringing Post Created By User On Thread Page////////////////////////////
document.addEventListener(`DOMContentLoaded`, async () => {

    const q1 = query(collection(db, "userDetails"));
    const querySnapshot = await getDocs(q1);
    const user = auth.currentUser
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        console.log(doc.data().userName)
        if (user.email == doc.data().userEmail) {
            console.log(doc.data().userName)
            profileUser.textContent = doc.data().userName
        }
    })

    const q = query(collection(db, "threads"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let threadList = document.getElementById(`threadList`)
        threadList.innerHTML = ''
        const user = auth.currentUser
        querySnapshot.forEach((doc) => {

            if (user.uid == doc.data().userID) {
                console.log(doc.id)
                const li = document.createElement('li');
                const dataCont = document.createElement(`div`);
                const butCont = document.createElement(`div`);
                butCont.setAttribute(`class`, `flex items-center`)
                dataCont.classList.add('py-2');

                const h3 = document.createElement('h3');
                h3.classList.add('text-base', 'font-semibold', 'text-blue-700');
                h3.textContent = doc.data().threadTitle;

                const p = document.createElement('p');
                p.classList.add('text-blue-500');
                let dateinSec = doc.data().timestamp.seconds
                let fullDate = new Date(dateinSec * 1000)
                console.log(fullDate)
                // Step 3: Extract the components of the date(day , year and month)
                const day = fullDate.getDate();
                const year = fullDate.getFullYear();
                const month = fullDate.toLocaleString('en-us', { month: 'long' }); // Get the full month name

                // Step 4: Format the date components as a string
                const formattedDate = `${day} ${month} ${year}`;
                p.textContent = 'Posted on ' + formattedDate;

                // let butdiv = document.createElement('button')
                // butdiv.setAttribute(`class`, `border-2 `)
                // let but2div = document.createElement('button')
                // but2div.setAttribute(`class`, `border-2`)
                const button = document.createElement('button');
                button.setAttribute(`ref`, `${doc.id}`)
                button.setAttribute(`class`, `ml-auto px-4 py-2 w-full text-center text-xs sm:text-normal font-semibold bg-blue-500 text-white rounded-full`)
                button.textContent = 'View Post';
                button.addEventListener(`click`, openViewModal)
                button.addEventListener(`click`, viewPostDetails)

                const button2 = document.createElement('button');
                button2.setAttribute(`ref`, `${doc.id}`)
                button2.setAttribute(`class`, `ml-auto px-4 py-2 w-full text-center text-xs sm:text-normal font-semibold bg-blue-500 text-white rounded-full`)
                button2.textContent = 'Delete Post';
                button2.addEventListener(`click`, openmessageModal)
                button2.addEventListener(`click`, dispmessageModel)
                // Append elements to the list item
                butCont.setAttribute(`class`, `flex flex-col justify-center p-1 sm:flex-row sm:space-x-2 sm:items-baseline sm:m-0 whitespace-nowrap items-center space-y-2`)
                butCont.append(button, button2)
                dataCont.append(h3, p)
                li.append(dataCont, butCont);
                li.setAttribute(`class`, `flex justify-between items-center`)
                // Append the list item to the threadList element
                const threadList = document.getElementById('threadList');
                threadList.appendChild(li);
            }
        }
            // }
            // i++
        );

    });
    //}

    //////////////////Bringing BioDetails on Domload////////////////////

    let userprofHeader = document.getElementById(`userprofHeader`)
    let userBiography = document.getElementById(`userBiography`)

    console.log(user)
    const docRef = doc(db, "usersProfileDetails", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        userprofHeader.textContent = docSnap.data().Header
        userBiography.textContent = docSnap.data().Biography
    } else {
        // docSnap.data() will be undefined in this case
        console.log("Add Biodata");
    }

})
///////////////////////////Edit|Bio-Button-Modal////////////////////////////////
let editBioBut = document.getElementById(`editBio`)
const modal = document.getElementById('createPollModal');
const closeModal = modal.getElementsByClassName('createPoll-modal-close')[0];
const modalContainer = modal.getElementsByClassName('createPoll-modal-container')[0];
const modalOverlay = modal.getElementsByClassName('createPoll-modal-overlay')[0];
editBioBut.addEventListener('click', () => {
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
///////////////////////////Edit|Bio prevInput value///////////////////////
let prevInputVal = () => {

    let profHeader = document.getElementById(`profHeader`)
    let profBio = document.getElementById(`profBio`)
    let userprofHeader = document.getElementById(`userprofHeader`)
    let userBiography = document.getElementById(`userBiography`)

    profHeader.value = userprofHeader.textContent
    profBio.value = userBiography.textContent
}

editBioBut.addEventListener(`click`, prevInputVal)

//////////////////////Edit Bio Main Function//////////////////

let editBio = async () => {

    let profHeader = document.getElementById(`profHeader`)
    let profBio = document.getElementById(`profBio`)
    let userprofHeader = document.getElementById(`userprofHeader`)
    let userBiography = document.getElementById(`userBiography`)
    const user = auth.currentUser
    const docRef = doc(db, "usersProfileDetails", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());

        const washingtonRef = doc(db, "usersProfileDetails", docSnap.id);
        // Set the "capital" field of the city 'DC'
        await updateDoc(washingtonRef, {
            Header: profHeader.value,
            Biography: profBio.value
        });
        userprofHeader.textContent = profHeader.value
        userBiography.textContent = profBio.value
    } else {
        // docSnap.data() will be undefined in this case
        // addBiography
        // console.log("No such document!");
        //////////////////Adding User Bio Details in DB/////////////////////////////////
        let profHeader = document.getElementById(`profHeader`)
        let profBio = document.getElementById(`profBio`)
        let userprofHeader = document.getElementById(`userprofHeader`)
        let userBiography = document.getElementById(`userBiography`)

        const user = auth.currentUser
        await setDoc(doc(db, "usersProfileDetails", user.uid), {
            Name: profileUser.textContent,
            Biography: profBio.value,
            Header: profHeader.value
        });

        userBiography.textContent = profBio.value
        userprofHeader.textContent = profHeader.value

    }

}
let BioInfosubmitBut = document.getElementById(`Bio-Info-submitBut`)
BioInfosubmitBut.addEventListener(`click`, editBio)


const messageDisplayModal = document.getElementById('myModal');
const messagecloseModal = messageDisplayModal.getElementsByClassName('error-modal-close')[0];
const messagemodalContainer = messageDisplayModal.getElementsByClassName('error-modal-container')[0];
const messagemodalOverlay = messageDisplayModal.getElementsByClassName('error-modal-overlay')[0];
///////////////////////////////Messgae Respond Modal///////////////////////////////////

let openmessageModal = async (event) => {
    event.preventDefault()
    console.log(event.target.getAttribute(`ref`))
    let refDoc = event.target.getAttribute(`ref`)
    const postDoc = await deleteDoc(doc(db, "threads", refDoc));
    if (!postDoc) {
        const modalText = document.getElementById(`Response`);
        modalText.innerText = `Post has been Succesfully Deleted`
    }
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



const CheckingUser = (user) => {
    if (user) {
      
      console.log('User is logged in:', user.email);

    } else {
    
      console.log('User is logged out');
      location.href = `./signin.html`;

    }
  };
  
  onAuthStateChanged(auth, CheckingUser)




