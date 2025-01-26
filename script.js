import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { calBirthday } from "./calBirthday.js";
import { getAdvice } from "./api.js";

const firebaseConfig = {
  apiKey: "AIzaSyBfOADyUL-Pj80l_DPhgpWNmj9EZ9qIQ5o",
  authDomain: "fir-authenticationdemo-de4a2.firebaseapp.com",
  projectId: "fir-authenticationdemo-de4a2",
  storageBucket: "fir-authenticationdemo-de4a2.firebasestorage.app",
  messagingSenderId: "566796984961",
  appId: "1:566796984961:web:72afd097133d8d954ba380",
  measurementId: "G-PMB0LQ6C58",
  databaseURL: "https://fir-authenticationdemo-de4a2-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

window.showForm = function(formId) {
  document.getElementById('welcomeMessage').style.display = 'none';
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('signupForm').style.display = 'none';
  document.getElementById(formId).style.display = 'block';
};

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const dob = document.getElementById('dob').value;
    const gender = document.getElementById('gender').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmpassword = document.getElementById('confirmPassword').value;

    if (validateForm(username, dob, gender, email, password, confirmpassword)) {
      if (password === confirmpassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log('User has been created:', user.uid);
            showModal('Your login is created');

            set(ref(database, 'users/' + user.uid), {
              username: username,
              dob: dob,
              gender: gender,
              email: email
            });
          })
          .catch((error) => {
            console.error('Error creating user:', error);
            showModal('Error creating user : ' + error.message);
          });
      } else {
        showModal('Passwords do not match');
      }
    } else {
      showModal('Please fill in all the fields');
    }
  });

  document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (validateForm(email, password)) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User logged in:', user.uid);

        const snapshot = await get(child(ref(database), `users/${user.uid}`));
        if (snapshot.exists()) {
          const userData = snapshot.val();
          let userBirthday = new Date(userData.dob);
          const today = new Date();
          // Convert userBirthday to local time
        userBirthday = new Date(userBirthday.toLocaleString('en-US', { timeZone: 'America/Denver' }));
        today.setHours(0, 0, 0, 0);

          console.log("User Birthday:", userBirthday);
          console.log("Today:", today);
         
          
          const x=userBirthday.getUTCDate()
          const y=today.getUTCDate()
          console.log("checking x value...",x);
          console.log("checking y value...",y);
          // Use UTC methods for accurate comparison
          const isBirthdayToday = (userBirthday.getUTCDate() === today.getUTCDate()) && (userBirthday.getUTCMonth() === today.getUTCMonth());
          console.log("checking...",isBirthdayToday);
          if (isBirthdayToday) {
            console.log("check -2 " )
            const userName = userData.username;
            const quote = await getAdvice();
            const message = `Happy Birthday, ${userName}! 🎉`;
            //Store user ID in localStorage
          localStorage.setItem('userId', user.uid);
          localStorage.setItem('message', message);
          localStorage.setItem('quote',quote)


          // Redirect to dashboard page
          window.location.href = 'dashboard.html';
          //showModal(message);

          } else {
            console.log("check - else " ,today)
            const daysLeft = calBirthday(userData.dob);
            const quote = await getAdvice();
            const userName = userData.username;
            const message = `Hello, ${userName}! There are ${daysLeft} days left until your next birthday.`;
            localStorage.setItem('userId', user.uid);
            localStorage.setItem('message', message);
            localStorage.setItem('quote',quote)
            // Redirect to dashboard page
            window.location.href = 'dashboard.html';
            showModal(message);
          }
        } else {
          console.log('No user data available');
        }
      } catch (error) {
        console.error('Error logging in:', error);
        showModal('Error logging in -> password or email is not correct:');
      }
    } else {
      showModal('Please fill in all the fields');
    }
  });
  if (document.getElementById('logoutButton')) {
    document.getElementById('logoutButton').addEventListener('click', function() {
      signOut(auth).then(() => {
        console.log('User logged out');
        localStorage.removeItem('userId');
        window.location.href = 'index.html';  // Redirect to login page after logout
      }).catch((error) => {
        console.error('Error logging out:', error);
      });
    });
  }

  if (document.getElementById('greeting')) {
    displayDashboard();
  }

});


function showModal(message) {
  const modal = document.getElementById('alertModal');
  const modalBody = document.getElementById('alertModalBody');
  const closeBtn = document.getElementsByClassName('close')[0];
  
  modalBody.textContent = message;
  modal.style.display = 'block';

  closeBtn.onclick = function() {
    modal.style.display = 'none';

    document.getElementById('welcomeMessage').style.display = 'block';
    document.querySelector('#loginForm form').reset();
    document.querySelector('#signupForm form').reset();
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'none';
  };
}

function validateForm(...fields) {
  for (const field of fields) {
    if (!field || field.trim() === '') {
      return false;
    }
  }
  return true;
}

async function displayDashboard() {
  const userId = localStorage.getItem('userId');
 
  if (!userId) {
    window.location.href = 'index.html';  // Redirect to login page if no user is logged in
    return;
  }

  
};
