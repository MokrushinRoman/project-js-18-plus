import { getMovieDetails } from '../filmsApi';
import {
  addMovieInLocaleStorage,
  removeMovieInLocaleStorage,
  findMoviesInLocaleStorage,
} from './local-storage';
import { pageList } from './my-library';
import { renderMoviesList } from './my-library';

export function getRefs() {
  const refs = {
    modalEl: document.querySelector('[data-modal]'),
    bodyEl: document.querySelector('body'),
    idTargetCard: '',
    modalCloseBtn: '',
    movieListEL: '',
    watchedBtn: '',
    queueBtn: '',
    movieList: document.querySelector('.movie-list'),
  };
  return refs;
}

const refs = getRefs();

export function getModal(selector) {
  refs.movieListEL = document.querySelector(selector);
  refs.movieListEL.addEventListener('click', onModalOpen);
}

async function onModalOpen(e) {
  if (e.target.nodeName !== 'IMG') {
    return;
  }
  refs.idTargetCard = e.target.parentElement.attributes.id.value;
  const movie = await createModal().then(response => {
    return response;
  });
  createModalMarkup(movie);
  refs.modalEl.classList.remove('backdrop_is-hidden');
  getAccessToBtn();
  refs.watchedBtn.addEventListener('click', onWatched);
  refs.queueBtn.addEventListener('click', onQueue);
  refs.modalCloseBtn.addEventListener('click', onModalClose);
  document.addEventListener('keydown', onKeyDown);
  refs.modalEl.addEventListener('click', onClickOutside);
  refs.bodyEl.classList.add('overflow-hidden');
  function onWatched(e) {
    const btn = e.target;
    handlerClickBtn('watched', btn);
  }

  function onQueue(e) {
    const btn = e.target;
    handlerClickBtn('queue', btn);
  }

  function handlerClickBtn(listName, btn) {
    const valueBtn = btn.textContent.trim().toLowerCase();

    const isOnCurrentList = findMoviesInLocaleStorage(listName, movie.id);
    const otherListName = listName === 'watched' ? 'queue' : 'watched';
    const otherBtn =
      otherListName === 'watched' ? refs.watchedBtn : refs.queueBtn;
    const isOnOtherList = findMoviesInLocaleStorage(otherListName, movie.id);
    if (valueBtn === `add to ${listName}`) {
      if (isOnCurrentList) {
        return;
      }
      addMovieInLocaleStorage(listName, movie);
      if (isOnOtherList) {
        removeMovieInLocaleStorage(otherListName, movie.id);
        otherBtn.innerHTML = `add to ${otherListName}`;
        if (pageList) {
          renderMoviesList(pageList);
        }
      }

      btn.innerHTML = `remove from ${listName}`;
      if (pageList) {
        renderMoviesList(listName);
      }
      return;
    }

    btn.innerHTML = isOnCurrentList
      ? `add to ${listName}`
      : `remove from ${listName}`;

    removeMovieInLocaleStorage(listName, movie.id);
    if (!otherListName) {
      return;
    }
    if (pageList) {
      renderMoviesList(listName);
    }
  }

  function onModalClose() {
    refs.idTargetCard = '';
    refs.modalEl.classList.add('backdrop_is-hidden');
    resetModal();
    document.removeEventListener('keydown', onKeyDown);
    refs.modalEl.removeEventListener('click', onClickOutside);
    refs.watchedBtn.removeEventListener('click', onWatched);
    refs.queueBtn.removeEventListener('click', onQueue);
    refs.bodyEl.classList.remove('overflow-hidden');
  }

  function onKeyDown(e) {
    e.code === 'Escape' && onModalClose();
  }

  function onClickOutside(e) {
    e.target === refs.modalEl && onModalClose();
  }
}

async function createModal() {
  return await getMovieDetails(refs.idTargetCard).then(response => {
    return response;
  });
}

function getAccessToBtn() {
  refs.modalCloseBtn = refs.modalEl.querySelector('[data-modal-close]');
  refs.watchedBtn = refs.modalEl.querySelector('[data-control-watched]');
  refs.queueBtn = refs.modalEl.querySelector('[data-control-turn]');
}

function createModalMarkup({
  id,
  title,
  original_title,
  popularity,
  vote_average,
  vote_count,
  overview,
  genres,
  poster_path,
}) {
  const genreList = quantityRegulator(genres);
  const voteAverage = vote_average.toFixed(1);
  const popularityValue = popularity.toFixed(1);
  const markup = `<div class="modal">
    <button type="button" class="close-button" data-modal-close>
      <svg class="close-button__icon" width="30" height="30" xmlns="http://www.w3.org/2000/svg>
        <defs>
        <symbol viewBox="0 0 32 32">
        <path d="M23.733 10.304l-1.504-1.504-5.963 5.963-5.963-5.963-1.504 1.504 5.963 5.963-5.963 5.963 1.504 1.504 5.963-5.963 5.963 5.963 1.504-1.504-5.963-5.963 5.963-5.963z">
        </path>
        </symbol>
        </defs>
      </svg>
    </button>
    <div class="modal__poster-container">
      <img src="https://image.tmdb.org/t/p/w500/${poster_path}" alt="The poster of the movie '${original_title}' " class="modal__poster-item" />
    </div>
    <div class="modal__content-container">
      <h2 class="modal__title">${title}</h2>
      <div class="modal__content-thumb">
        <table class="modal__table">
          <tbody>
            <tr>
              <th>Vote / Votes</th>
              <td class="modal__table_slash">
                <span class="modal__table_bc_accent">${voteAverage}</span>&#47;
                <span class="modal__table_bc_grey">${vote_count}</span>
              </td>
            </tr>
            <tr>
              <th>Popularity</th>
              <td>${popularityValue}</td>
            </tr>
            <tr>
              <th>Original Title</th>
              <td>${original_title}</td>
            </tr>
            <tr>
              <th>Genre</th>
              <td>${genreList}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="modal__text-thumb">
        <h3 class="modal__text modal__text_upper">About</h3>
        <p class="modal__description">
          ${overview}
        </p>
      </div>
      <div class="modal-button__thumb">
        <button
          type="button"
          class="modal-button modal-button_accent"
          data-control-watched
        >
          ${
            findMoviesInLocaleStorage('watched', id)
              ? 'remove from Watched'
              : 'Add to Watched'
          }
        </button>
        <button type="button" class="modal-button" data-control-turn>
          ${
            findMoviesInLocaleStorage('queue', id)
              ? 'remove from queue'
              : 'Add to queue'
          }
        </button>
      </div>
    </div>
  </div>`;
  return refs.modalEl.insertAdjacentHTML('afterbegin', markup);
}

function resetModal() {
  refs.modalEl.innerHTML = '';
}

function quantityRegulator(arr) {
  if (arr.length <= 2) {
    return arr
      .map(item => {
        return item.name;
      })
      .join(', ');
  } else {
    return `${arr[0].name}, ${arr[1].name}, Other`;
  }
}
