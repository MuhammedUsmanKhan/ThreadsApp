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
      let body = document.getElementByTagName(`body`)
              body.classList.remove(`bg-SIn`)
      let formContainer = document.getElementById(`formContainer`)
      let redirectContainer = document.getElementById(`redirectContainer`)
  
      if (!formContainer.classList.contains(`hidden`)) {
  
        formContainer.classList.add(`hidden`)
        redirectContainer.classList.remove(`hidden`)
  
      }
  
      let sec = 3;
      const redirectHeading = document.getElementById('redirectHeading');
  
      const myIntervalFunction = () => {
        redirectHeading.textContent = `Redirecting You to Your Profile Page in ${sec} seconds`;
        sec--;
  
        if (sec < 0) {
          clearInterval(interval);
          // Perform the redirect here, e.g.:
          window.location.href = './profile.html';
        }
      };
  
      const interval = setInterval(myIntervalFunction, 1000); // 1000 milliseconds = 1 second
    } else {
    
      console.log('User is logged out');
    }
  };
  
  onAuthStateChanged(auth, CheckingUser)
