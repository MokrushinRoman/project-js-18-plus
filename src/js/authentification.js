import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { Notify } from 'notiflix';
import auth from '../firebase';
const logInBtn = document.getElementById('logIn');
const signUpBtn = document.getElementById('signUp');
const logInForm = document.getElementById('logInForm');
const signUpForm = document.getElementById('signUpForm');
const passRegExp = /(?=.*?[A-Z])(?=.*?[a-z]).{6,}/;
const emailRegExp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const emailInput = document.querySelector('#email');
// get modal
const modal = document.querySelector('.auth-modal');
//get close btn
const close = document.getElementById('auth-close');

const handleClickOutsideModal = () => {
  closeAuthModal();
};
const handleCloseModal = () => {
  closeAuthModal();
};
const setErrorMessage = (input, message) => {
  const formControl = input.closest('.form-control');
  const errorContainer = formControl.querySelector('small');
  errorContainer.innerText = message;
  formControl.className = 'form-control error';
};
const clearErrors = () => {
  const formControls = document.querySelectorAll('.form-control');
  formControls.forEach(el => {
    if (el.classList.contains('error')) {
      el.querySelector('small').innerText = '';
      el.classList.remove('error');
    }
  });
};
closeAuthModal = () => {
  clearErrorMessage();
  const authFormElements = document.querySelectorAll('.auth-form');

  // reset form
  logInForm.reset();
  //remove listeners
  window.removeEventListener('click', handleClickOutsideModal);
  close.removeEventListener('click', handleCloseModal);
  logInForm.removeEventListener('submit', createUser);
  authFormElements.forEach(el => {
    if (el.classList.contains('hide')) {
      return;
    }
    el.classList.add('hide');
  });
  // hide modal
  // authForm.classList.add('hide');
};
let errorMessageTimeOut;
const validateSignUpForm = e => {
  e.preventDefault();
  const {
    elements: { email, password },
  } = e.currentTarget;
  const emailValue = email.value.trim();

  const passValue = password.value.trim();
  const isEmailValid = emailRegExp.test(emailValue);

  let errors = false;
  if (!emailValue) {
    setErrorMessage(email, 'email cannot be empty');
    errors = true;
  } else if (!isEmailValid) {
    setErrorMessage(email, 'fill correct email');
    errors = true;
  }
  const isPassValid = passRegExp.test(passValue);

  if (!passValue) {
    setErrorMessage(password, 'password cannot be empty');
    errors = true;
  } else if (!isPassValid) {
    setErrorMessage(
      password,
      'should contain  one upper and one small letter and be 6 or more symbols'
    );
    errors = true;
  }
  errors
    ? (errorMessageTimeOut = setTimeout(() => {
        clearErrors();
      }, 3000))
    : createUser(emailValue, passValue);
};
const validateSignInForm = e => {
  e.preventDefault();
  const {
    elements: { email, password },
  } = e.currentTarget;
  const emailValue = email.value.trim();
  const passValue = password.value.trim();
  let errors = false;
  if (!emailValue) {
    setErrorMessage(email, 'email cannot be empty');
    errors = true;
  }
  if (!passValue) {
    setErrorMessage(password, 'password cannot be empty');
    errors = true;
  }
  if (passValue.length < 6) {
    setErrorMessage(password, 'password cannot less than 6 symbols');
    errors = true;
  }
  return errors
    ? (errorMessageTimeOut = setTimeout(() => {
        clearErrors();
      }, 3000))
    : toggleSignIn(emailValue, passValue);
};
clearErrorMessage = () => {
  clearTimeout(errorMessageTimeOut);
};
const createUser = async (email, password) => {
  await createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      // Signed in
      const user = userCredential.user;
      auth.currentUser;
      togglePrivateRoutes();
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      Notify.failure(errorMessage);
      // ..
    });
};

function toggleSignIn(email, password) {
  if (auth.currentUser) {
    auth.signOut();
    togglePrivateRoutes();
  } else {
    // Sign in with email and pass.
    signInWithEmailAndPassword(auth, email, password).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;

      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        Notify.failure('Wrong password!');
      } else if (errorCode === 'auth/user-not-found') {
        Notify.failure("User doesn't exist");
      } else {
        Notify.failure(errorMessage);
      }
    });
  }
  // document.getElementById('quickstart-sign-in').disabled = true;
}
auth.onAuthStateChanged(function (user) {
  if (user) {
    togglePrivateRoutes();
    // User is signed in.
    var displayName = user.displayName;
    //
    var email = user.email;

    // var emailVerified = user.emailVerified;
    // var photoURL = user.photoURL;
    // var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    document.getElementById('quickstart-sign-in-status').textContent =
      'Logged in';
    logInBtn.textContent = 'Log out';
    closeAuthModal();
    // document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
    // if (!emailVerified) {
    //   document.getElementById('quickstart-verify-email').disabled = false;
    // }
  } else {
    // User is signed out.
    document.getElementById('quickstart-sign-in-status').textContent =
      'Logged out';
    logInBtn.textContent = 'Log in';

    // document.getElementById('quickstart-account-details').textContent = 'null';
  }
  // document.getElementById('quickstart-sign-in').disabled = false;
});

// Hide what user should not see if not logged
function togglePrivateRoutes() {
  const privateRoutes = document.querySelectorAll('.private-route');
  privateRoutes.forEach(routeElement => routeElement.classList.toggle('hide'));
}
// handle close modal

// handle click outside of modal to close it
window.addEventListener('click', e => {
  if (e.target == modal) {
    closeAuthModal();
  }
});
showLogInForm = () => {
  modal.classList.toggle('hide');
  logInForm.classList.remove('hide');
  close.addEventListener('click', handleCloseModal);

  // logInForm.classList.toggle('hide');
  emailInput.focus();
  logInForm.addEventListener('submit', validateSignInForm);
};

showSignInForm = () => {
  modal.classList.toggle('hide');
  signUpForm.classList.remove('hide');
  close.addEventListener('click', handleCloseModal);

  // logInForm.classList.toggle('hide');
  signUpForm.addEventListener('submit', validateSignUpForm);
};
// Access auth elements
const authAction = document.querySelectorAll('.auth');

// check attribute what action
authAction.forEach(item => {
  item.addEventListener('click', e => {
    let chosen = e.target.getAttribute('auth');
    if (chosen === 'show-log-in-form') {
      if (auth.currentUser) {
        togglePrivateRoutes();

        return auth.signOut();
      }
      showLogInForm();
    } else {
      showSignInForm();
    }
  });
});
