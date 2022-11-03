userId = '111';
// test1 = { watched: [], queue: [] };
// localStorage.setItem(userId, JSON.stringify(test1));

export function getMoviesFromLocalStorage(listName) {
  try {
    return (movies = localStorage.getItem(userId)
      ? JSON.parse(localStorage.getItem(userId))
      : { watched: [], queue: [] });
  } catch (e) {
    console.log(e);
  }
}

export function addMovieInLocaleStorage(listName, movie) {
  try {
    const moviesFromLocaleStorage = getMoviesFromLocalStorage(userId);
    moviesFromLocaleStorage[listName].push(movie);
    localStorage.setItem(userId, JSON.stringify(moviesFromLocaleStorage));
  } catch (e) {
    console.log(e);
  }
}

export function removeMovieInLocaleStorage(listName, movieId) {
  try {
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
