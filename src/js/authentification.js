import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { Notify } from 'notiflix';
import auth from '../firebase';
const logInBtn = document.getElementById('logIn');
const logInForm = document.getElementById('logInForm');
const signUpForm = document.getElementById('signUpForm');
const libraryBtn = document.getElementById('libraryButton');
const passRegExp = /(?=.*?[A-Z])(?=.*?[a-z]).{6,}/;
const emailRegExp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

const emailInput = document.querySelector('#email');
// [SM] get modal
const modal = document.querySelector('.auth-modal');
// [SM]get close btn
const close = document.getElementById('auth-close');

// [SM] handle click outside of modal to close it
const handleClickOutsideModal = e => {
  if (e.target == modal) {
    closeAuthModal();
  }
};
const handleEscClick = e => {
  console.log('e: ', e);
  if (e.key === 'Escape') {
    closeAuthModal();
  }
};

// [SM] handle click on close btn in modal to close modal
const handleCloseModal = () => {
  closeAuthModal();
};
// [SM] handle error message
const setErrorMessage = (input, message) => {
  // [SM]take closest parent for easier find error message container related to current  element
  const formControl = input.closest('.form-control');
  const errorContainer = formControl.querySelector('small');
  errorContainer.innerText = message;
  formControl.className = 'form-control error';
};
// [SM] clear erros to default
const clearErrors = () => {
  const formControls = document.querySelectorAll('.form-control');
  formControls.forEach(el => {
    if (el.classList.contains('error')) {
      el.querySelector('small').innerText = '';
      el.classList.remove('error');
    }
  });
};

// [SM] fully close modal and clear listeners
closeAuthModal = () => {
  clearErrorMessage();
  const authFormElements = document.querySelectorAll('.auth-form');
  // [SM] reset form
  logInForm.reset();
  signUpForm.reset();
  // [SM]remove listeners
  window.removeEventListener('click', handleClickOutsideModal);
  window.removeEventListener('keyup', handleEscClick);
  close.removeEventListener('click', handleCloseModal);
  logInForm.removeEventListener('submit', createUser);
  // [SM]hide what should be hidden
  authFormElements.forEach(el => {
    if (el.classList.contains('hide')) {
      return;
    }
    el.classList.add('hide');
  });
};
let errorMessageTimeOut;
// [SM]Check sign up validation
const validateSignUpForm = e => {
  e.preventDefault();
  const {
    elements: { email, password, username },
  } = e.currentTarget;
  const emailValue = email.value.trim();
  const nameValue = username.value.trim();
  const passValue = password.value.trim();
  const isEmailValid = emailRegExp.test(emailValue);

  let errors = false;
  if (!nameValue) {
    setErrorMessage(username, 'name cannot be empty');
    errors = true;
  } else if (nameValue.length < 3) {
    setErrorMessage(username, 'name should be at least 3 symbols');
    errors = true;
  }
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
      'should contain at least one lower and one upper case and be 6 or more symbols'
    );
    errors = true;
  }
  errors
    ? (errorMessageTimeOut = setTimeout(() => {
        clearErrors();
      }, 3000))
    : createUser({ email: emailValue, password: passValue, name: nameValue });
};
// [SM]check Loggin for valid
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
// [SM] clear timeOut
clearErrorMessage = () => {
  clearTimeout(errorMessageTimeOut);
};
// [SM] create user
async function createUser({ email, password, name }) {
  await createUserWithEmailAndPassword(auth, email, password)
    .then(async userCredential => {
      // [SM] Signed in
      // TODO create and handle name here
      // togglePrivateRoutes();
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      Notify.failure(errorMessage);
    });
  await updateProfile(auth.currentUser, { displayName: name })
    .then(result => {
      const userName = auth.currentUser?.displayName;
    })
    .catch(err => console.warn(err));
}
// [SM] check sign in or should logout
function toggleSignIn(email, password) {
  if (auth.currentUser) {
    togglePrivateRoutes();
    auth.signOut();
  } else {
    // [SM] Sign in with email and pass.
    signInWithEmailAndPassword(auth, email, password).catch(function (error) {
      // [SM] Handle Errors here.
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
    // [SM] User is signed in.
    var displayName = user.displayName;
    var email = user.email;

    // var emailVerified = user.emailVerified;
    // var photoURL = user.photoURL;
    // var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;

    logInBtn.textContent = 'Log out';
    closeAuthModal();
  } else {
    logInBtn.textContent = 'Log in';
  }
});

// [SM] Hide what user should not see if not logged
function togglePrivateRoutes() {
  const privateRoutes = document.querySelectorAll('.private-route');
  privateRoutes.forEach(routeElement => routeElement.classList.toggle('hide'));
}
// [SM] handle close modal

// [SM] open login form
showLogInForm = () => {
  modal.classList.toggle('hide');
  logInForm.classList.remove('hide');
  // [SM] handle click outside of modal to close it
  window.addEventListener('click', handleClickOutsideModal);
  // [SM] handle click escape  to close   modal
  window.addEventListener('keyup', handleEscClick);
  close.addEventListener('click', handleCloseModal);

  // [SM] logInForm.classList.toggle('hide');
  emailInput.focus();
  logInForm.addEventListener('submit', validateSignInForm);
};
// [SM] open sign in form
showSignInForm = () => {
  modal.classList.toggle('hide');
  signUpForm.classList.remove('hide');
  // [SM] handle click outside of modal to close it
  window.addEventListener('click', handleClickOutsideModal);
  // [SM] handle click escape  to close   modal
  window.addEventListener('keyup', handleEscClick);
  close.addEventListener('click', handleCloseModal);

  signUpForm.addEventListener('submit', validateSignUpForm);
};
// [SM] Access auth elements
const authAction = document.querySelectorAll('.auth');

// [SM] check attribute what action
authAction.forEach(item => {
  item.addEventListener('click', e => {
    let chosen = e.target.getAttribute('auth');
    if (chosen === 'show-log-in-form') {
      if (auth.currentUser) {
        // [SM] if user logged in, then it was clicke to logout so lets do logout
        togglePrivateRoutes();

        return auth.signOut();
      }
      showLogInForm();
    } else {
      showSignInForm();
    }
  });
});
