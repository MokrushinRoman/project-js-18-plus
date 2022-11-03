import '../js/myLibrary';
import { searchMovies, getTrending } from '../filmsApi';

const fetchParams = {
  query: null,
  page: 1,
};

let totalPages = "";
let maxPages = 10;
const serchForm = document.querySelector('#search-form');
const movieList = document.querySelector('.movie-list');
let pagBtnEl = document.querySelector('.pagination-buttons');
serchForm.addEventListener('submit', onSerchSubmit);

async function onSerchSubmit(e) {
  e.preventDefault();
  movieList.innerHTML = "";
  pagBtnEl.remove();
  fetchParams.query = serchForm.elements.searchQuery.value.toLowerCase().trim();
  fetchParams.page = 1;
  console.log(fetchParams);
  await newMovieSearch(fetchParams); 
  const paginationButtons = new PaginationButton(totalPages, fetchParams.page).render();
}

const pageNumbers = (total, max, current) => {
  const half = Math.floor(max / 2);
  let to = max;
  
  if(current + half >= total) {
    to = total;
  } else if(current > half) {
    to = current + half ;
  }
  
  let from = Math.max(to - max, 0);

  return Array.from({length: Math.min(total, max)}, (_, i) => (i + 1) + from);
}

function crateNewPage() {
  if (!fetchParams.query) {
    movieList.innerHTML = "";
    const page = fetchParams.page;
    return nextRandomMovies({ page });
  }
  return nextUserMovies(fetchParams);
};

const card = ({
  imgUrl,
  title,
  id,
}) => `<li id="${id}" class="movie-list__item movie">
    <img
    class="movie__img"
      src=${imgUrl ? `https://image.tmdb.org/t/p/w200${imgUrl} ` : ''}
      alt="${title}"
      loading="lazy"
    />
    <MovieTittle title={title}>${title}</MovieTittle>
</li>`;

async function nextRandomMovies({ page }) {
  const result = await getTrending({ page }).then(
    ({ results }) => {
      const movieCards = results
        .map(
          ({
            title = '',
            name = '',
            poster_path,

            id,
          }) =>
            card({
              title: title ? title : name,
              imgUrl: poster_path,
              id,
            })
        )
        .join('');
      return movieCards;
    }
  );
  movieList.innerHTML = result;
}

async function newMovieSearch(params) {
  const result = await searchMovies(params).then(
    ({ results, total_pages }) => {
      totalPages = total_pages;
      const movieCards = results
        .map(
          ({
            title = '',
            name = '',
            poster_path,

            id,
          }) =>
            card({
              title: title ? title : name,
              imgUrl: poster_path,
              id,
            })
        )
        .join('');

      return movieCards;
    }
  );
  movieList.innerHTML = result;
}

async function nextUserMovies(params) {
  const result = await searchMovies(params).then(
    ({ results, total_pages }) => {
      totalPages = total_pages;
      const movieCards = results
        .map(
          ({
            title = '',
            name = '',
            poster_path,

            id,
          }) =>
            card({
              title: title ? title : name,
              imgUrl: poster_path,
              id,
            })
        )
        .join('');

      return movieCards;
    }
  );
  movieList.innerHTML = result;
}

export default function PaginationButton(total, current) {
  totalPages = total;
  let currentPage = current;
  const maxPagesVisible = maxPages;
  fetchParams.page = currentPage;
  let pages = pageNumbers(totalPages, maxPagesVisible, currentPage);
  let currentPageBtn = null;
  const buttons = new Map();
  const disabled = {
    start: () => currentPage === 1 || currentPage > totalPages,
    prev: () => pages[0] === 1,
    end: () => currentPage >= totalPages,
    next: () => pages.slice(-1)[0] === totalPages
  }
  
  const frag = document.createDocumentFragment();
  const paginationButtonContainer = document.createElement('div');
  paginationButtonContainer.className = 'pagination-buttons';

  const createAndSetupButton = (label = '', cls = '', disabled = false, handleClick) => {
    const buttonElement = document.createElement('button');
    buttonElement.textContent = label;
    buttonElement.className = `page-btn ${cls}`;
    buttonElement.disabled = disabled;
    buttonElement.addEventListener('click', e => {
      fetchParams.page = handleClick(e);
      crateNewPage();
      console.log(fetchParams);
      this.update();
      paginationButtonContainer.value = currentPage;
      paginationButtonContainer.dispatchEvent(new CustomEvent('change', {detail: {currentPageBtn}}));
    });
    
    return buttonElement;
  }
  
  const onPageButtonClick = e => currentPage = Number(e.currentTarget.textContent);
  
  const onPageButtonUpdate = index => (btn) => {
    btn.textContent = pages[index];
    
    if(pages[index] === currentPage) {
      currentPageBtn.classList.remove('active');
      btn.classList.add('active');
      currentPageBtn = btn;
      currentPageBtn.focus();
    }
  };
  
  buttons.set(
    createAndSetupButton('', 'start-page', disabled.start(), () => currentPage = 1),
    (btn) => btn.disabled = disabled.start()
  )
  
  buttons.set(
    createAndSetupButton('', 'prev-page', disabled.prev(), () => currentPage -= 1),
    (btn) => btn.disabled = disabled.prev()
  
  )
  
  pages.map((pageNumber, index) => {
    const isCurrentPage = currentPage === pageNumber;
    const button = createAndSetupButton(
      pageNumber, isCurrentPage ? 'active' : '', false, onPageButtonClick
    );
    
    if(isCurrentPage) {
      currentPageBtn = button;
    }
    
    buttons.set(button, onPageButtonUpdate(index));
  });
  
  buttons.set(
    createAndSetupButton('', 'next-page', disabled.next(), () => currentPage += 1),
    (btn) => btn.disabled = disabled.next()
  )
  
  buttons.set(
    createAndSetupButton('', 'end-page', disabled.end(), () => currentPage = totalPages),
    (btn) => btn.disabled = disabled.end()
  )
  
  buttons.forEach((_, btn) => frag.appendChild(btn));
  paginationButtonContainer.appendChild(frag);
  
  this.render = (container = document.querySelector('main')) => {
    container.appendChild(paginationButtonContainer);
    pagBtnEl = document.querySelector('.pagination-buttons');
  }
 
  this.update = (newPageNumber = currentPage) => {
    currentPage = newPageNumber;
    pages = pageNumbers(totalPages, maxPagesVisible, currentPage);
    buttons.forEach((updateButton, btn) => updateButton(btn));
  }
  
  this.onChange = (handler) => {
    paginationButtonContainer.addEventListener('change', handler);
  }
}

export default function createPaginations(total, current) {
  const paginationButtons = new PaginationButton(total, current).render();
}; 
