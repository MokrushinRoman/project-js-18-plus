import { getTrending } from './filmsApi';

import './js/homepage';
import './js/my-library';
import './js/students-modal';
import { getModal } from './js/modal';

import PaginationButton from './js/pagination.js';

const paginationButtons = new PaginationButton(20, 5);
getModal('.movie-list');

paginationButtons.render();

paginationButtons.onChange(e => {
  console.log('-- changed', e.target.value);
});
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

  document.querySelector('.movie-list').innerHTML = result;
}
movies({ page });
currentLocation = window.location.href;
console.log('currentLocation: ', currentLocation);
