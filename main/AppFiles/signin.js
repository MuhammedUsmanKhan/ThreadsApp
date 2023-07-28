import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword , onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, collection, getDocs,addDoc, orderBy, serverTimestamp, query, onSnapshot, where, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyClpo8swwA_PSFRGYDqOgWkVRwPjloDt5c",
    authDomain: "threadapp-3129d.firebaseapp.com",
    projectId: "threadapp-3129d",
    storageBucket: "threadapp-3129d.appspot.com",
    messagingSenderId: "902832742728",
    appId: "1:902832742728:web:c80c2d85e2921748a5937d"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
//const db = getFirestore(app)
let but = document.querySelector(`#but`)
but.addEventListener(`click`, async () => {
    
  //if(!localStorage.getItem(`userData`)){

    //let userData = []
    // const q = query(collection(db, "userDetails"));

    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //   console.log(doc.id, " => ", doc.data());
   
    //   let obj = {
    //         'Name' : doc.data().userName,
    //         'emailID': doc.data().userEmail
    //       }
          
    //      if(!localStorage.getItem('userData')){
      //        userData.push(obj)
      
    // });
    //localStorage.setItem(`userData`,JSON.stringify(userData))
  //}
  
  
  let email = document.querySelector(`#Semail`).value
    let password = document.querySelector(`#Spass`).value
    
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            location.href = `./profile.html`
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
 })

const CheckingUser = (user) => {
    if (user) {
      
      console.log('User is logged in:', user.email);

      location.href = `./profile.html`;

    } else {
    
      console.log('User is logged out');
    }
  };
  
  onAuthStateChanged(auth, CheckingUser)

// let obj = {
//     'Name' : userName,
//     'emailID': email
//   }
//   let userData = []
  
//   if(!localStorage.getItem('userData')){
//       userData.push(obj)
//       localStorage.setItem(`userData`,JSON.stringify(userData))
//      }else{
//       let userDataPar = localStorage.getItem(`userData`,userData)
//       let parseduserData = JSON.parse(userDataPar)
//       parseduserData.push(obj)
//       localStorage.setItem(`userData`,JSON.stringify(parseduserData))
//      }