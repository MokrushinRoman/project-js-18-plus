import { getTrending } from './filmsApi';

import './js/homepage';
import './js/myLibrary';
import './js/students-modal';
import { getModal } from './js/modal';
import { renderCards } from './js/movieCard';
import createPaginations from './js/pagination.js';
import { hideLoader, showLoader } from './js/loader';
getModal('.movie-list');

let totalPages = 0;
let page = 1;
let itemsPerPage = 20;
let timeWindow = 'day';

export async function movies({ page }) {
  showLoader();

  const result = await getTrending({ page }).then(
    ({ results, total_pages }) => {
      totalPages = total_pages;
      return renderCards(results);
    }
  );

  document.querySelector('.movie-list').innerHTML = result;

  createPaginations(totalPages, page);
}
movies({ page }).then(() => hideLoader());
