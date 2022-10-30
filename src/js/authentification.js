import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import auth from '../firebase';
const logInBtn = document.getElementById('logIn');
const signInBtn = document.getElementById('signIn');
// const signInForm = document.getElementById('signInForm');
const logInForm = document.getElementById('logInForm');
const passRegExp = '/(?=.*?[A-Z])(?=.*?[a-z]).{6,}/';
const emailRegExp =
  '/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/';
const emaliInput = logInForm.querySelector('#email');
// get modal
const modal = document.querySelector('.auth-modal');
//get close btn
const close = document.getElementById('auth-close');

const handleClickOutsideModal = () => {
  closeAuthModal();
};
const handleCloseModal = () => {
  console.log('clossse icon');
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
    console.log('fired');
    if (el.classList.contains('error')) {
      el.querySelector('small').innerText = '';
      el.classList.remove('error');
    }
  });
};
closeAuthModal = () => {
  const authForm = document.querySelector('.auth-form');
  logInForm.reset();

  window.removeEventListener('click', handleClickOutsideModal);
  close.removeEventListener('click', handleCloseModal);
  logInForm.removeEventListener('submit', createUser);
  authForm.classList.add('hide');
};
let errorMessageTimeOut;
const validateSignUpForm = e => {
  e.preventDefault();
  const {
    elements: { email, password },
  } = e.currentTarget;
  const emailValue = email.value.trim();
  const passValue = password.value.trim();
  const isEmailValid = emailValue.match(emailRegExp);
  if (!emailValue) {
    setErrorMessage(email, 'email cannot be empty');
  } else if (!isEmailValid) {
    setErrorMessage(email, 'fill correct email');
  }
  const isPassValid = passValue.match(passRegExp);
  if (!passValue) {
    setErrorMessage(password, 'password cannot be empty');
  } else if (!isPassValid) {
    setErrorMessage(
      password,
      'should contain  one upper and one small letter and be 6 or more symbols'
    );
  }
  errorMessageTimeOut = setTimeout(() => {
    clearErrors();
  }, 3000);
};
const validateSignInForm = e => {
  return toggleSignIn();
};
clearMessage = () => {
  clearTimeout(errorMessageTimeOut);
};
const createUser = ({ email, password }) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      // Signed in
      const user = userCredential.user;
      // ...
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    })
    .finally(() => {});
};

function toggleSignIn(email, password) {
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
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      closeAuthModal();
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

    // document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
    // if (!emailVerified) {
    //   document.getElementById('quickstart-verify-email').disabled = false;
    // }
  } else {
    closeAuthModal();
    // User is signed out.
    document.getElementById('quickstart-sign-in-status').textContent =
      'Logged out';
    logInBtn.textContent = 'Log in';
    signInBtn.classList.remove('hide');
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
  close.addEventListener('click', handleCloseModal);

  // logInForm.classList.toggle('hide');
  emaliInput.focus();
  logInForm.addEventListener('submit', validateSignInForm);
  //  e => {
  //   e.preventDefault();
  //   console.log('logInForm.checkValidity(): ', logInForm.checkValidity());
  //   if (!logInForm.checkValidity()) return;

  //   // logInForm.classList.toggle('hide');

  //   toggleSignIn(email, password);
  // });
};

showSignInForm = () => {
  modal.classList.toggle('hide');
  close.addEventListener('click', handleCloseModal);

  // logInForm.classList.toggle('hide');
  logInForm.addEventListener('submit', validateSignUpForm);
  // e => {
  //   e.preventDefault();
  //   const {
  //     elements: {
  //       email: { value: email },
  //       password: { value: password },
  //     },
  //   } = e.currentTarget;
  //   // const checkPass = `//`;
  //   createUser({ email, password });
  // });
};
// Access auth elements
const authAction = document.querySelectorAll('.auth');

// check attribute what action
authAction.forEach(item => {
  item.addEventListener('click', e => {
    let chosen = e.target.getAttribute('auth');
    if (chosen === 'show-log-in-form') {
      if (auth.currentUser) {
        auth.signOut();
      }
      showLogInForm();
    } else {
      showSignInForm();
    }
  });
});
