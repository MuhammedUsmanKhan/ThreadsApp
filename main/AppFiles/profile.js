import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, collection, getDocs, setDoc, addDoc, orderBy, serverTimestamp, query, onSnapshot, where, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


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

                let butdiv = document.createElement('button')
                butdiv.setAttribute(`class`,`border-2 `)
                let but2div = document.createElement('button')
                but2div.setAttribute(`class`,`border-2`)
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


})

// let userAddProfInfo = async () => {

//     const user = auth.currentUser

//     let profHeader = document.getElementById(`profHeader`)
//     let userBiography = document.getElementById(`userBiography`)


//     console.log(user.uid)

//     await setDoc(doc(db, "userProfileInfo", user.uid), {
//         userName: profileUser.textContent,
//         Biography: userBiography.textContent,
//         Header: "USA"
//     });

// }
// Add a new document in collection "cities"

// document.addEventListener(`DOMContentLoaded`,()=>{
//     if(!localStorage.getItem(`userData`))
//     {
//       signOut(auth).then(() => {
//         alert('succesfully signed out')
//         location.href = './signin.html'
//       }).catch((error) => {
//         // An error happened.
//         console.log('sign in first')
//       });
//     }
//   })
