import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword , onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";


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