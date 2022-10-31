import { getMovieDetails } from '../filmsApi';

const modalEl = document.querySelector('[data-modal]');
const bodyEl = document.querySelector('body');
let idTargetCard = '';
let modalCloseBtn = '';
let movieListEL = '';

export function getModal (selector) {
  movieListEL = document.querySelector(selector);
  movieListEL.addEventListener('click', onModalOpen);
};

async function onModalOpen(e) {
  if (e.target.nodeName !== 'IMG') {
    return;
  }
  idTargetCard = e.target.parentElement.attributes.id.value;
  await createModal();
  modalEl.classList.remove('backdrop_is-hidden');
  modalCloseBtn = modalEl.querySelector('[data-modal-close]');
  modalCloseBtn.addEventListener('click', onModalClose);
  document.addEventListener('keydown', onKeyDown);
  bodyEl.classList.add('overflow-hidden');
};

async function createModal() {
  await getMovieDetails(idTargetCard).then(response => {
    return createModalMarkup(response);
  });
};

function createModalMarkup({
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
          Add to Watched
        </button>
        <button type="button" class="modal-button" data-control-turn>
          Add to queue
        </button>
      </div>
    </div>
  </div>`;
  return modalEl.insertAdjacentHTML('afterbegin', markup);
};

function onModalClose() {
  idTargetCard = '';
  modalEl.classList.add('backdrop_is-hidden');
  resetModal();
  document.removeEventListener('keydown', onKeyDown);
  bodyEl.classList.remove('overflow-hidden');
};

function onKeyDown(e) {
  if (e.code !== 'Escape') {
    return;
  }
  onModalClose();
};

function resetModal() {
  modalEl.innerHTML = '';
};

function quantityRegulator(arr) {
    if (arr.length <= 2) {
      return arr.map(item => {
          return item.name;
        })
        .join(', ');
    } else {
      return `${arr[0].name}, ${arr[1].name}, Other`;
    }
};