import { getTrending } from './filmsApi';
import './js/homepage';
import './js/myLibrary';

let totalPages = 0;
let page = 1;
let itemsPerPage = 20;
let timeWindow = 'day';

const card = ({
  imgUrl,
  title,
  id,
}) => `<li id=""${id} class="movie-list__item movie">
    <img
		class="movie__img"
      src=${imgUrl ? `https://image.tmdb.org/t/p/w200${imgUrl} ` : ''}
      alt="${title}"
      loading="lazy"
    />
    <MovieTittle title={title}>${title}</MovieTittle>
</li>`;

const movies = async () => {
  const result = await getTrending({ timeWindow, page, itemsPerPage }).then(
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
      console.log(movieCards);
      return movieCards;
    }
  );
  document.querySelector('.movie-list').innerHTML = result;
};
movies();
