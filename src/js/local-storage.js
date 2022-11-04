import auth from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
let userId;
onAuthStateChanged(auth, user => {
  if (user) {
    userId = user.uid;
    return;
  }
  userId = '';
});

export function getMoviesFromLocalStorage() {
  if (!userId) {
    return;
  }
  return localStorage.getItem(userId)
    ? JSON.parse(localStorage.getItem(userId))
    : { watched: [], queue: [] };
}

export function addMovieInLocaleStorage(listName, movie) {
  if (!userId) {
    return;
  }
  const moviesFromLocaleStorage = getMoviesFromLocalStorage();
  moviesFromLocaleStorage[listName].push(movie);
  localStorage.setItem(userId, JSON.stringify(moviesFromLocaleStorage));
}

export function removeMovieInLocaleStorage(listName, movieId) {
  if (!userId) {
    return;
  }
  const moviesFromLocaleStorage = getMoviesFromLocalStorage();
  const findIndexMovie = moviesFromLocaleStorage[listName].findIndex(
    movie => movie.id === movieId
  );
  if (findIndexMovie > -1) {
    moviesFromLocaleStorage[listName].splice(findIndexMovie, 1);
    localStorage.setItem(userId, JSON.stringify(moviesFromLocaleStorage));
  }
}

export function findMoviesInLocaleStorage(listName, movieId) {
  if (!userId) {
    return;
  }
  const moviesFromLocaleStorage = getMoviesFromLocalStorage();
  return (
    moviesFromLocaleStorage[listName].findIndex(movie => movie.id === movieId) >
    -1
  );
}
