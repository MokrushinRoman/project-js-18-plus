import { showLoader, hideLoader } from './loader';


const watchedBtnRef = document.querySelector('.btn__watched');
const queueBtnRef = document.querySelector('.btn__queue');
const libraryListError = document.querySelector('.library-list__error');
const movieList = document.querySelector('.movie-list');

watchedBtnRef.addEventListener('click', onWatchedBtnClick);
queueBtnRef.addEventListener('click', onQueueBtnClick);

function onWatchedBtnClick() {
  if (watchedBtnRef.classList.contains('btn__library--active')) return;

  watchedBtnRef.classList.add('btn__library--active');
  queueBtnRef.classList.remove('btn__library--active');

  getFilmsInlocalStorage('watched');
}

function onQueueBtnClick() {
  if (queueBtnRef.classList.contains('btn__library--active')) return;

  queueBtnRef.classList.add('btn__library--active');
  watchedBtnRef.classList.remove('btn__library--active');

  getFilmsInlocalStorage('queue');
}

function getFilmsInlocalStorage(nameList) {
  showLoader();
  const movies = localStorage.getItem(nameList)
    ? [...JSON.parse(localStorage.getItem(nameList))]
    : [];

  if (checkCountMovies(movies)) {
    if (movies) {
      movieList.innerHTML = movieListMarkup(movies);
    }
  }
  hideLoader();
}

function checkCountMovies(arrMovies) {
  if (arrMovies.length < 1) {
    libraryListError.style.display = 'block';
    libraryListError.innerHTML = 'Oops, films not found!';
    movieList.innerHTML = '';
    return false;
  }
  libraryListError.style.display = 'none';
  libraryListError.innerHTML = '';
  return true;
}

function movieListMarkup(arrMovies) {
  return arrMovies
    .map(({ title, poster_path, id }) => {
      return `<li id="${id}" class="movie-list__item movie">
        <img class="movie__img" src=${
          poster_path ? `https://image.tmdb.org/t/p/w200${poster_path} ` : ''
        }
          alt="${title}" loading="lazy"
        />
        <MovieTittle title={title}>${title}</MovieTittle>
      </li>`;
    })
    .join('');
}
