import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged , createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

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


let but = document.querySelector(`#but`)
but.addEventListener(`click`, () => {
  let userName = document.querySelector(`#userName`).value
  let email = document.querySelector(`#uemail`).value
  let password = document.querySelector(`#upass`).value 

  let obj = {
    'Name' : userName,
    'emailID': email
  }
  let userData = []
  
  if(!localStorage.getItem('userData')){
      userData.push(obj)
      localStorage.setItem(`userData`,JSON.stringify(userData))
     }else{
      let userDataPar = localStorage.getItem(`userData`,userData)
      let parseduserData = JSON.parse(userDataPar)
      parseduserData.push(obj)
      localStorage.setItem(`userData`,JSON.stringify(parseduserData))
     }
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
  //    users++
      
      const user = userCredential.user;
      alert("hogaya")
     // location.href = `./profile.html`
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
})