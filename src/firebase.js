// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

//  Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCl5Wo2b4Rz6dNL_iduEEZayJD7MKRZhDY',
  authDomain: 'my-movies-library.firebaseapp.com',
  projectId: 'my-movies-library',
  storageBucket: 'my-movies-library.appspot.com',
  messagingSenderId: '1011498679169',
  appId: '1:1011498679169:web:2a0d9bb427953772970680',
  measurementId: 'G-GWT7FCX40W',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app);
export default auth;
