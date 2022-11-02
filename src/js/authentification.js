import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { Notify } from 'notiflix';
import auth from '../firebase';
import { onClickBtnHome } from './homepage';
import { hideLoader, showLoader } from './loader';
const refs = {
  logInBtn: document.getElementById('logIn'),
  logInForm: document.getElementById('logInForm'),
  signUpForm: document.getElementById('signUpForm'),
  emailInput: document.querySelector('#email'),
  passwordInput: document.querySelector('#password'),
  modal: document.querySelector('.auth-modal'),
  close: document.getElementById('auth-close'),
  logOutBtn: document.getElementById('logOutButton'),
};
// const libraryBtn = document.getElementById('libraryButton');
const passRegExp = /(?=.*?[A-Z])(?=.*?[a-z]).{6,}/;
const emailRegExp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

// [SM]get close btn

// [SM] handle click outside of modal to close it
handleClickOutsideModal = e => {
  if (e.target == refs.modal) {
    closeAuthModal();
  }
};
const handleEscClick = e => {
  if (e.key === 'Escape') {
    closeAuthModal();
  }
};
const handleLogOutClicked = () => {
  onClickBtnHome();
  toggleSignIn();
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
const removeEventListeners = () => {
  window.removeEventListener('click', handleClickOutsideModal);
  window.removeEventListener('keyup', handleEscClick);
  refs.close.removeEventListener('click', handleCloseModal);
  refs.logInForm?.removeEventListener('submit', validateSignInForm);
  refs.signUpForm?.removeEventListener('submit', validateSignUpForm);
};
// [SM] fully close modal and clear listeners
closeAuthModal = () => {
  clearErrorMessage();
  const authFormElements = document.querySelectorAll('.auth-form');
  // [SM] reset form
  refs.logInForm?.reset();
  refs.signUpForm?.reset();
  // [SM]remove listeners
  removeEventListeners();
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
  if (errors) {
    errorMessageTimeOut = setTimeout(() => {
      clearErrors();
    }, 3000);
  } else {
    showLoader();
    createUser({ email: emailValue, password: passValue, name: nameValue });
  }
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
      console.log('userCredential: ', userCredential);
      const user = userCredential.user;
      if (user) {
        await updateProfile(user, { displayName: name })
          .then(() => {})
          .catch(err => {
            Notify.warning("Name wasn't saved");
          });
      }
      var displayName = user.displayName;
      const userContainer = document.querySelector('#userContainer');
      if (userContainer) {
        userContainer.innerText = displayName;
      }
    })
    .catch(error => {
      hideLoader();

      const errorCode = error.code;
      const errorMessage = error.message;
      Notify.failure(errorMessage);
    });
}
// [SM] check sign in or should logout
function toggleSignIn(email, password) {
  if (auth.currentUser) {
    togglePrivateRoutes();

    auth.signOut();
  } else {
    showLoader();
    // [SM] Sign in with email and pass.
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        hideLoader();
      })
      .catch(function (error) {
        // [SM] Handle Errors here.
        var errorCode = error.code;

        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          Notify.failure('Wrong email or password!');
        } else if (errorCode === 'auth/user-not-found') {
          Notify.failure("User doesn't exist");
        } else {
          Notify.failure(errorMessage);
        }
        hideLoader();
      });
  }
}
auth.onAuthStateChanged(function (user) {
  if (user) {
    togglePrivateRoutes();
    // [SM] User is signed in.

    let displayName = user.displayName;
    if (displayName) {
      const userContainer = document.querySelector('#userContainer');
      if (userContainer) {
        userContainer.innerText = displayName;
        refs.logOutBtn.addEventListener('click', handleLogOutClicked);
      }
    }

    // var emailVerified = user.emailVerified;
    // var photoURL = user.photoURL;
    // var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    hideLoader();
    closeAuthModal();
  } else {
    refs.logOutBtn?.removeEventListener('click', handleLogOutClicked);

    hideLoader();
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
  refs.modal.classList.toggle('hide');
  refs.logInForm.classList.remove('hide');
  // [SM] handle click outside of modal to close it
  window.addEventListener('click', handleClickOutsideModal);
  // [SM] handle click escape  to close   modal
  window.addEventListener('keyup', handleEscClick);
  refs.close.addEventListener('click', handleCloseModal);

  // [SM] logInForm.classList.toggle('hide');
  refs.emailInput.focus();
  refs.logInForm.addEventListener('submit', validateSignInForm);
};
// [SM] open sign in form
showSignInForm = () => {
  refs.modal.classList.toggle('hide');
  const parentWrapper = refs.signUpForm.closest('.auth-form');
  parentWrapper.classList.remove('hide');
  // [SM] handle click outside of modal to close it
  window.addEventListener('click', handleClickOutsideModal);
  // [SM] handle click escape  to close   modal
  window.addEventListener('keyup', handleEscClick);
  refs.close.addEventListener('click', handleCloseModal);

  refs.signUpForm.addEventListener('submit', validateSignUpForm);
};
// [SM] Access auth elements
const authAction = document.querySelectorAll('.auth__button');

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
