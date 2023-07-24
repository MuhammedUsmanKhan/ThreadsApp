import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, collection, addDoc, orderBy, serverTimestamp, query, onSnapshot, where, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


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
//console.log(auth.authStateSubscription.auth.currentUser)
window.addEventListener(`storage`,()=>{
    if(!localStorage.getItem(`userData`))
    {
      signOut(auth).then(() => {
        alert('succesfully signed out')
        location.href = './signin.html'
      }).catch((error) => {
        // An error happened.
        console.log('sign in first')
      });
    }
})  
document.addEventListener(`DOMContentLoaded`,()=>{
    if(!localStorage.getItem(`userData`))
    {
      signOut(auth).then(() => {
        alert('succesfully signed out')
        location.href = './signin.html'
      }).catch((error) => {
        // An error happened.
        console.log('sign in first')
      });
    }
})
document.addEventListener(`DOMContentLoaded`, () => {

    // 
    //if(auth) {
    //const user = auth.currentUser
    //let i = 0
    const q = query(collection(db, "threads"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const user = auth.currentUser
        const userData = JSON.parse(localStorage.getItem(`userData`))
        console.log(userData)
        //const user = auth.currentUser;
        let profieUser = document.getElementById(`userName`)
        let userName;
        console.log(user.email)
        for (let i = 0; i < userData.length; i++) {
            if (user.email == userData[i].emailID) {
                console.log(userData[i].Name)
                userName = userData[i].Name
            }
        }
        profieUser.textContent = userName
        querySnapshot.forEach((doc) => {
            // console.log(user)
            //      let userData = localStorage.getItem(`userData`)
            //    let parsedUserData = JSON.parse(userData)
            //   for (let i = 0; i < parsedUserData.length; i++) {
            console.log(user.email)
            if (user.uid == doc.data().userID) {
                console.log(doc.data())
                const li = document.createElement('li');
                const dataCont = document.createElement(`div`);
                const butCont = document.createElement(`div`);
                butCont.setAttribute(`class`, `flex items-center`)
                dataCont.classList.add('py-2');

                const h3 = document.createElement('h3');
                h3.classList.add('text-base', 'font-semibold');
                h3.textContent = doc.data().threadTitle;

                const p = document.createElement('p');
                p.classList.add('text-gray-600');
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

                const button = document.createElement('button');
                button.setAttribute(`class`, `ml-auto px-4 py-2 text-center font-semibold bg-blue-500 text-white rounded-full`)
                button.textContent = 'View Post';
                // Append elements to the list item
                butCont.appendChild(button)
                dataCont.append(h3, p)
                li.append(dataCont, butCont);
                li.setAttribute(`class`, `flex justify-between`)
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
