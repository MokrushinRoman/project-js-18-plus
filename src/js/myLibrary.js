import { showLoader, hideLoader } from './loader';
import { getMoviesFromLocalStorage } from './local-storage';
import { renderCards } from './movieCard';

const watchedBtnRef = document.querySelector('#btn__watched');
const queueBtnRef = document.querySelector('#btn__queue');
const libraryListError = document.querySelector('.library-error');

const movieList = document.querySelector('.movie-list');
export let pageList = '';

watchedBtnRef.addEventListener('click', onWatchedBtnClick);
queueBtnRef.addEventListener('click', onQueueBtnClick);

export function onWatchedBtnClick() {
  // if (watchedBtnRef.classList.contains('btn__library--active')) return;
  showLoader();
  watchedBtnRef.className = 'library__btn library__btn--active';
  queueBtnRef.classList.remove('library__btn--active');
  pageList = 'watched';
  renderMoviesList('watched');
  hideLoader();
}

function onQueueBtnClick() {
  console.log('clicked');
  showLoader();
  queueBtnRef.className = 'library__btn library__btn--active';
  watchedBtnRef.classList.remove('library__btn--active');
  pageList = 'queue';
  renderMoviesList('queue');
  hideLoader();
}

export function renderMoviesList(listName) {
  if (listName !== pageList) {
    return;
  }
  const movies = getMoviesFromLocalStorage()[listName];
  if (checkCountMovies(movies)) {
    console.log('movies: ', movies);
    if (movies.length) {
      movieList.innerHTML = movieListMarkup(movies);
    }
  }
}

export function checkCountMovies(arrMovies) {
  if (arrMovies.length < 1) {
    libraryListError.style.display = 'block';
    movieList.innerHTML = '';
    return false;
  }
  libraryListError.style.display = 'none';
  return true;
}

function movieListMarkup(arrMovies) {
  return renderCards(arrMovies);
}
