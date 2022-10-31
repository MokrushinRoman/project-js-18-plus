import { getMovieDetails } from '../filmsApi';

export function getRefs() {
  const refs = {
    modalEl: document.querySelector('[data-modal]'),
    bodyEl: document.querySelector('body'),
    idTargetCard: '',
    modalCloseBtn: '',
    movieListEL: '',
    watchedBtn: '',
    queueBtn: '',
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
  await createModal();
  refs.modalEl.classList.remove('backdrop_is-hidden');
  getAccessToBtn();
  refs.modalCloseBtn.addEventListener('click', onModalClose);
  document.addEventListener('keydown', onKeyDown);
  refs.modalEl.addEventListener('click', onClickOutside);
  refs.bodyEl.classList.add('overflow-hidden');
}

async function createModal() {
  await getMovieDetails(refs.idTargetCard).then(response => {
    return createModalMarkup(response);
  });
}

function getAccessToBtn() {
  refs.modalCloseBtn = refs.modalEl.querySelector('[data-modal-close]');
  refs.watchedBtn = refs.modalEl.querySelector('[data-control-watched]');
  refs.queueBtn = refs.modalEl.querySelector('[data-control-turn]');
}

function onModalClose() {
  refs.idTargetCard = '';
  refs.modalEl.classList.add('backdrop_is-hidden');
  resetModal();
  document.removeEventListener('keydown', onKeyDown);
  refs.modalEl.removeEventListener('click', onClickOutside);
  refs.bodyEl.classList.remove('overflow-hidden');
}

function onKeyDown(e) {
  e.code === 'Escape' && onModalClose();
}

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
    <svg
      class="close-button__icon"
      width="30"
      height="30"
      xmlns="http://www.w3.org/2000/svg
    >
      <defs>
        <symbol viewBox="0 0 32 32">
          <path
            d="M23.733 10.304l-1.504-1.504-5.963 5.963-5.963-5.963-1.504 1.504 5.963 5.963-5.963 5.963 1.504 1.504 5.963-5.963 5.963 5.963 1.504-1.504-5.963-5.963 5.963-5.963z"
          ></path>
        </symbol>
      </defs>
    </svg>
  </button>
  <div class="modal__poster-container">
    <img
      src="https://image.tmdb.org/t/p/w500/${poster_path}"
      alt="The poster of the movie '${original_title}' "
      class="modal__poster-item"
    />
  </div>
  <div class="modal__content-container">
    <h2 class="modal__title">${title}</h2>
    <div class="modal__content-thumb">
      <ul class="modal__table">
        <li class="modal__table_grey">
          <p>Vote / Votes</p>
        </li>
        <li class="modal__table_grey">
          <p>
            <span class="modal__table_bc_accent">${voteAverage}</span>&#32;&#47;&#32; 
            <span class="modal__table_bc_grey">${vote_count}</span>
          </p>
        </li>
        <li class="modal__table_grey">
          <p>Popularity</p>
        </li>
        <li><p>${popularityValue}</p></li>
        <li class="modal__table_grey"><p>Original Title</p></li>
        <li><p>${original_title}</p></li>
        <li class="modal__table_grey"><p>Genre</p></li>
        <li><p>${genreList}</p></li>
      </ul>
    </div>
    <div class="modal__text-thumb">
      <h3 class="modal__description-title">About</h3>
      <p class="modal__description">${overview}</p>
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
  return refs.modalEl.insertAdjacentHTML('afterbegin', markup);
}

function onClickOutside(e) {
  e.target === refs.modalEl && onModalClose();
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
