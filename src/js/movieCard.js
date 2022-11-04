import placeholderImg from '../images/film.jpg';
import Genres from '../genres.json';
Number.prototype.between = function (a, b) {
  var min = Math.min.apply(Math, [a, b]),
    max = Math.max.apply(Math, [a, b]);
  return this > min && this < max;
};
const viewPorts = {
  desktop: 1280,
  tablet: 768,
  mobile: 320,
};
const currentWidth = window.innerWidth;
function getGenresById(genre_ids) {
  if (genre_ids !== undefined && genre_ids.length !== 0) {
    // const tmpLoad = load(GENREFILMS_LOCALSTORAGE_KEY)
    //   ? load(GENREFILMS_LOCALSTORAGE_KEY)
    //   : [];
    // const allGenres = Array.from(tmpLoad);

    const myGenres = Genres.filter(genre => genre_ids.includes(genre.id));

    return myGenres.length > 3
      ? myGenres
          .slice(0, 3)
          .map(genre => genre.name)
          .join(', ') + ', Other'
      : myGenres.map(genre => genre.name).join(', ');
  } else return 'No genres found';
}

export function renderCards(data) {
  const movieCardMarkup = data
    ?.map(
      ({
        id,
        title,
        poster_path,
        release_date,
        vote_average,
        genre_ids,
        name,
      }) => {
        const genresNames = getGenresById(genre_ids);
        const defaultImageUrl = new URL('../images/film.jpg', import.meta.url);
        const movieTitle = title ?? name ?? 'no title';
        const imgUrl = poster_path
          ? `https://image.tmdb.org/t/p/w300${poster_path}`
          : `${defaultImageUrl.href}`;
        const srcSet = poster_path
          ? `https://image.tmdb.org/t/p/w400${poster_path} 1280w `
          : '';
        return `<li class="movie-card"  id="${id}">
    <img data-src="${imgUrl}" srcset=${srcSet} src="${imgUrl}" alt="${movieTitle}" class="lazyload  movie-card__img">
    <p class="movie-card__title">${movieTitle}</p>
    <div class="movie-card__details">
    <p class="movie-card__genres">${genresNames} </p>
      ${
        release_date
          ? `<p class="movie-card__year">&nbsp;|&nbsp;${release_date.slice(
              0,
              4
            )}</p>`
          : ''
      }

    ${
      vote_average
        ? `<p class="movie-card__rating">${vote_average.toFixed(1)}</p>`
        : ''
    }
  </div>
</li>`;
      }
    )
    .join('');
  return movieCardMarkup;
}
