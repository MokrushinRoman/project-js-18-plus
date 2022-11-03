import auth from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
let userId;
// onAuthStateChanged(auth, user => {
//   if (user) {
//     userId = user.uid;
//   }
// });
userId = '5CUd0vw3kJXZfOfswPTjJul5Jxa2'; //временно так как не могу получить из firebase

export function getMoviesFromLocalStorage(listName) {
  try {
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
    const moviesFromLocaleStorage = getMoviesFromLocalStorage(userId);
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
    const moviesFromLocaleStorage = getMoviesFromLocalStorage(userId);
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
    const moviesFromLocaleStorage = getMoviesFromLocalStorage(userId);
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
