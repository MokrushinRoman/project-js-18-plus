import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import auth from '../firebase';
const createUser = ({ email, password }) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      console.log('userCredential: ', userCredential);
      // Signed in
      const user = userCredential.user;
      // ...
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
};
function toggleSignIn(email, password) {
  closeAuthModal();
  if (auth.currentUser) {
    auth.signOut();
  } else {
    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }
    // Sign in with email and pass.
    signInWithEmailAndPassword(auth, email, password).catch(function (error) {
      console.log('error: ', error);
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      closeAuthModal();

      console.log(error);
      // document.getElementById('quickstart-sign-in').disabled = false;
    });
  }
  // document.getElementById('quickstart-sign-in').disabled = true;
}
auth.onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    // console.log('displayName: ', displayName);
    var email = user.email;
    // var emailVerified = user.emailVerified;
    // var photoURL = user.photoURL;
    // var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    // document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
    // document.getElementById('quickstart-sign-in').textContent = 'Sign out';
    // document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
    // if (!emailVerified) {
    //   document.getElementById('quickstart-verify-email').disabled = false;
    // }
  } else {
    console.log('log out');
    closeAuthModal();
    // User is signed out.
    // document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
    // document.getElementById('quickstart-sign-in').textContent = 'Sign in';
    // document.getElementById('quickstart-account-details').textContent = 'null';
  }
  // document.getElementById('quickstart-sign-in').disabled = false;
});
function closeAuthModal() {
  const formElements = document.querySelectorAll('.auth-form');
  formElements.forEach(el => {
    if (el.classList.contains('hide')) {
      return;
    }
    el.classList.add('hide');
  });
}
const signInForm = document.getElementById('signInForm');
const logInForm = document.getElementById('logInForm');
// get modal
const modal = document.querySelector('.auth-modal');
//get close btn
const close = document.getElementById('auth-close');
close.addEventListener('click', e => {
  closeAuthModal();
});
window.addEventListener('click', e => {
  console.log('e.target: ', e.target);
  if (e.target == modal) {
    closeAuthModal();
  }
});
showLogInForm = () => {
  modal.classList.toggle('hide');
  logInForm.classList.toggle('hide');
  logInForm.addEventListener('submit', e => {
    e.preventDefault();
    const {
      elements: {
        email: { value: email },
        password: { value: password },
      },
    } = e.currentTarget;
    logInForm.classList.toggle('hide');

    toggleSignIn(email, password);
  });
};
showSignInForm = () => {
  console.log('logInForm.classList: ', logInForm.classList);
  modal.classList.toggle('hide');

  signInForm.classList.toggle('hide');
  signInForm.addEventListener('submit', e => {
    e.preventDefault();
    const {
      elements: {
        email: { value: email },
        password: { value: password },
      },
    } = e.currentTarget;

    createUser({ email, password });
  });
};
// Access auth elements
const authAction = document.querySelectorAll('.auth');

// check attribute what action
authAction.forEach(item => {
  item.addEventListener('click', e => {
    let chosen = e.target.getAttribute('auth');
    if (chosen === 'show-log-in-form') {
      showLogInForm();
    } else {
      showSignInForm();
    }
  });
});
