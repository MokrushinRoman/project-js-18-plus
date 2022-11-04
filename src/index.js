import { getTrending } from './filmsApi';
import './js/homepage';
import './js/myLibrary';
import './js/students-modal';
import { getModal } from './js/modal';
import { renderCards } from './js/movieCard';
import createPaginations from './js/pagination.js';
getModal('.movie-list');

let totalPages = 0;
let page = 1;
let itemsPerPage = 20;
let timeWindow = 'day';
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

export async function movies({ page }) {
  const payload = {
    timeWindow: timeWindow || 'day',
    page: page || 1,
    itemsPerPage: itemsPerPage || 20,
  };
  const result = await getTrending({ page }).then(
    ({ results, total_pages }) => {
      totalPages = total_pages;
      return renderCards(results);
    }
  );

  document.querySelector('.movie-list').innerHTML = result;
  createPaginations(totalPages, page);
}
movies({ page });
currentLocation = window.location.href;
