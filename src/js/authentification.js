import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { Notify } from 'notiflix';
import auth from '../firebase';
const logInBtn = document.getElementById('logIn');
const logInForm = document.getElementById('logInForm');
const signUpForm = document.getElementById('signUpForm');
const passRegExp = /(?=.*?[A-Z])(?=.*?[a-z]).{6,}/;
const emailRegExp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const emailInput = document.querySelector('#email');
// get modal
const modal = document.querySelector('.auth-modal');
//get close btn
const close = document.getElementById('auth-close');

// handle click outside of modal to close it
const handleClickOutsideModal = () => {
  closeAuthModal();
};
// handle click on close btn in modal to close modal
const handleCloseModal = () => {
  closeAuthModal();
};
// handle error message
const setErrorMessage = (input, message) => {
  //take closest parent for easier find error message container related to current  element
  const formControl = input.closest('.form-control');
  const errorContainer = formControl.querySelector('small');
  errorContainer.innerText = message;
  formControl.className = 'form-control error';
};
// clear erros to default
const clearErrors = () => {
  const formControls = document.querySelectorAll('.form-control');
  formControls.forEach(el => {
    if (el.classList.contains('error')) {
      el.querySelector('small').innerText = '';
      el.classList.remove('error');
    }
  });
};

// fully close modal and clear listeners
closeAuthModal = () => {
  clearErrorMessage();
  const authFormElements = document.querySelectorAll('.auth-form');
  // reset form
  logInForm.reset();
  //remove listeners
  window.removeEventListener('click', handleClickOutsideModal);
  close.removeEventListener('click', handleCloseModal);
  logInForm.removeEventListener('submit', createUser);
  //hide what should be hidden
  authFormElements.forEach(el => {
    if (el.classList.contains('hide')) {
      return;
    }
    el.classList.add('hide');
  });
};
let errorMessageTimeOut;
//Check sign up validation
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
//check Loggin for valid
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
// clear timeOut
clearErrorMessage = () => {
  clearTimeout(errorMessageTimeOut);
};
// create user
async function createUser(email, password) {
  await createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      // Signed in
      const user = userCredential.user;
      auth.currentUser;
      //TODO create and handle name here
      togglePrivateRoutes();
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      Notify.failure(errorMessage);
      // ..
    });
}
// check sign in or should logout
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
    logInBtn.textContent = 'Log in';
  }
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
// open login form
showLogInForm = () => {
  modal.classList.toggle('hide');
  logInForm.classList.remove('hide');
  close.addEventListener('click', handleCloseModal);

  // logInForm.classList.toggle('hide');
  emailInput.focus();
  logInForm.addEventListener('submit', validateSignInForm);
};
// open sign in form
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
        // if user logged in, then it was clicke to logout so lets do logout
        togglePrivateRoutes();

        return auth.signOut();
      }
      showLogInForm();
    } else {
      showSignInForm();
    }
  });
});
