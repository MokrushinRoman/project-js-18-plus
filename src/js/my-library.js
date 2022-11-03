import { showLoader, hideLoader } from './loader';
import { getMoviesFromLocalStorage } from './local-storage';

const watchedBtnRef = document.querySelector('#btn__watched');
const queueBtnRef = document.querySelector('#btn__queue');
const libraryListError = document.querySelector('.library-error');

const movieList = document.querySelector('.movie-list');
export let pageList = '';

watchedBtnRef.addEventListener('click', onWatchedBtnClick);
queueBtnRef.addEventListener('click', onQueueBtnClick);

export function onWatchedBtnClick() {
  console.log('should call');
  // if (watchedBtnRef.classList.contains('btn__library--active')) return;

  showLoader();
  watchedBtnRef.classList.add('btn__library--active');
  queueBtnRef.classList.remove('btn__library--active');
  pageList = 'watched';
  renderMoviesList('watched');
  hideLoader();
}

function onQueueBtnClick() {
  if (queueBtnRef.classList.contains('btn__library--active')) return;
  showLoader();
  queueBtnRef.classList.add('btn__library--active');
  watchedBtnRef.classList.remove('btn__library--active');
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
  const defaultImageUrl = new URL(
    '../images/no-poster-available.jpg',
    import.meta.url
  );
  return arrMovies
    .map(({ title, poster_path, name, id }) => {
      return `<li id="${id}" class="movie-list__item movie">
        <img class="movie__img" src='${
          poster_path
            ? `https://image.tmdb.org/t/p/w200${poster_path} `
            : `${defaultImageUrl.href}`
        }'
          alt="${title ? title : name}" loading="lazy"
        />
        <MovieTittle title={title}>${title ? title : name}</MovieTittle>
      </li>`;
    })
    .join('');
}
