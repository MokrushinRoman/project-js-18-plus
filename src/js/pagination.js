import './myLibrary';
import { searchMovies, getTrending } from '../filmsApi';
import { Notify } from 'notiflix';
import { renderCards } from './movieCard';
import { hideLoader, showLoader } from './loader';

const fetchParams = {
  query: '',
  page: 1,
};

let paginationButtons = null;
let errorSerchEl = null;
let currentPage = null;
let totalPages = '';
let maxPages = 10;
export let pagBtnEl = document.querySelector('.pagination-buttons');
const serchForm = document.querySelector('#search-form');
const movieList = document.querySelector('.movie-list');

serchForm.addEventListener('submit', onSerchSubmit);

async function onSerchSubmit(e) {
  e.preventDefault();
  movieList.innerHTML = '';
  currentPage = 1;
  pagBtnEl?.remove();
  fetchParams.query = serchForm.elements.searchQuery.value.toLowerCase().trim();

  fetchParams.page = currentPage;
  showLoader();
  await newMovieSearch(fetchParams).catch(() => {
    createErrorMassage();
  });
}

const pageNumbers = (total, max, current) => {
  const half = Math.floor(max / 2);
  let to = max;

  if (current + half >= total) {
    to = total;
  } else if (current > half) {
    to = current + half;
  }

  let from = Math.max(to - max, 0);

  return Array.from({ length: Math.min(total, max) }, (_, i) => i + 1 + from);
};

function crateNewPage() {
  if (!fetchParams.query) {
    movieList.innerHTML = '';
    const page = fetchParams.page;
    showLoader();
    return nextRandomMovies({ page });
  }
  return nextUserMovies(fetchParams);
}

async function nextRandomMovies({ page }) {
  const result = await getTrending({ page }).then(({ results }) => {
    return renderCards(results);
  });
  hideLoader();
  movieList.innerHTML = result;
}

async function newMovieSearch(params) {
  let totalMovies = null;
  const result = await searchMovies(params).then(
    ({ results, total_pages, total_results }) => {
      totalMovies = total_results;
      totalPages = total_pages;
      return renderCards(results);
    }
  );
  hideLoader();
  if (!result) {
    pagBtnEl?.remove();
    hideLoader();
    createErrorMassage();
    return;
  }
  movieList.innerHTML = result;
  hideLoader();

  errorSerchEl && errorSerchEl.remove();

  totalMovies <= 20
    ? pagBtnEl?.remove()
    : createPaginations(totalPages, currentPage);
}

function createErrorMassage() {
  errorSerchEl && errorSerchEl.remove();
  const markup =
    '<div class="header__error-massage"><p>Search result not successful. Enter the correct movie name.</p></div>';
  serchForm.insertAdjacentHTML('afterend', markup);
  errorSerchEl = document.querySelector('.header__error-massage');
  hideLoader();
}

async function nextUserMovies(params) {
  const result = await searchMovies(params).then(({ results, total_pages }) => {
    totalPages = total_pages;
    return renderCards(results);
  });
  movieList.innerHTML = result;
  hideLoader();
}

export function PaginationButton(total, current) {
  totalPages = total;
  currentPage = current;
  const maxPagesVisible = maxPages;
  fetchParams.page = currentPage;
  let pages = pageNumbers(totalPages, maxPagesVisible, currentPage);
  let currentPageBtn = null;
  const buttons = new Map();
  const disabled = {
    start: () => currentPage === 1 || currentPage > totalPages,
    prev: () => pages[0] === 1,
    end: () => currentPage >= totalPages,
    next: () => pages.slice(-1)[0] === totalPages,
  };

  const frag = document.createDocumentFragment();
  const paginationButtonContainer = document.createElement('div');
  paginationButtonContainer.className = 'pagination-buttons';

  const createAndSetupButton = (
    label = '',
    cls = '',
    disabled = false,
    handleClick
  ) => {
    const buttonElement = document.createElement('button');
    buttonElement.textContent = label;
    buttonElement.className = `page-btn ${cls}`;
    buttonElement.disabled = disabled;
    buttonElement.addEventListener('click', e => {
      fetchParams.page = handleClick(e);
      crateNewPage();
      this.update();
      paginationButtonContainer.value = currentPage;
      paginationButtonContainer.dispatchEvent(
        new CustomEvent('change', { detail: { currentPageBtn } })
      );
    });

    return buttonElement;
  };

  const onPageButtonClick = e =>
    (currentPage = Number(e.currentTarget.textContent));

  const onPageButtonUpdate = index => btn => {
    btn.textContent = pages[index];

    if (pages[index] === currentPage) {
      currentPageBtn.classList.remove('active');
      btn.classList.add('active');
      currentPageBtn = btn;
      currentPageBtn.focus();
    }
  };

  buttons.set(
    createAndSetupButton(
      '',
      'start-page',
      disabled.start(),
      () => (currentPage = 1)
    ),
    btn => (btn.disabled = disabled.start())
  );

  buttons.set(
    createAndSetupButton(
      '',
      'prev-page',
      disabled.prev(),
      () => (currentPage -= 1)
    ),
    btn => (btn.disabled = disabled.prev())
  );

  pages.map((pageNumber, index) => {
    const isCurrentPage = currentPage === pageNumber;
    const button = createAndSetupButton(
      pageNumber,
      isCurrentPage ? 'active' : '',
      false,
      onPageButtonClick
    );

    if (isCurrentPage) {
      currentPageBtn = button;
    }

    buttons.set(button, onPageButtonUpdate(index));
  });

  buttons.set(
    createAndSetupButton(
      '',
      'next-page',
      disabled.next(),
      () => (currentPage += 1)
    ),
    btn => (btn.disabled = disabled.next())
  );

  buttons.set(
    createAndSetupButton(
      '',
      'end-page',
      disabled.end(),
      () => (currentPage = totalPages)
    ),
    btn => (btn.disabled = disabled.end())
  );

  buttons.forEach((_, btn) => frag.appendChild(btn));
  paginationButtonContainer.appendChild(frag);

  this.render = (container = document.querySelector('main')) => {
    container.appendChild(paginationButtonContainer);
    pagBtnEl = document.querySelector('.pagination-buttons');
  };

  this.update = (newPageNumber = currentPage) => {
    currentPage = newPageNumber;
    pages = pageNumbers(totalPages, maxPagesVisible, currentPage);
    buttons.forEach((updateButton, btn) => updateButton(btn));
  };

  this.onChange = handler => {
    paginationButtonContainer.addEventListener('change', handler);
  };
}

export default function createPaginations(total, current) {
  paginationButtons = new PaginationButton(total, current);
  paginationButtons.render();
}
