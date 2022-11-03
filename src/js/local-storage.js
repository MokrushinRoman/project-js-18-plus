import auth from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
let userId;
onAuthStateChanged(auth, user => {
  if (user) {
    userId = user.uid;
  }
});

export function getMoviesFromLocalStorage() {
  try {
    console.log(userId);
    if (!userId) {
      return;
    }
    return (movies = localStorage.getItem(userId)
      ? JSON.parse(localStorage.getItem(userId))
      : { watched: [], queue: [] });
  } catch (e) {
    console.log(e);
  }
}

export function addMovieInLocaleStorage(listName, movie) {
  try {
    if (!userId) {
      return;
    }
    const moviesFromLocaleStorage = getMoviesFromLocalStorage();
    moviesFromLocaleStorage[listName].push(movie);
    localStorage.setItem(userId, JSON.stringify(moviesFromLocaleStorage));
  } catch (e) {
    console.log(e);
  }
}

export function removeMovieInLocaleStorage(listName, movieId) {
  try {
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
  } catch (e) {
    console.log(e);
  }
}

export function findMoviesInLocaleStorage(listName, movieId) {
  try {
    if (!userId) {
      return;
    }
    const moviesFromLocaleStorage = getMoviesFromLocalStorage();
    if (
      moviesFromLocaleStorage[listName].findIndex(
        movie => movie.id === movieId
      ) > -1
    ) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
  }
}
