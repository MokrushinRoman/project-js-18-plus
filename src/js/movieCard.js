import placeholderImg from '../images/film.jpg';
import Genres from '../genres.json';
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
        original_title,
        overview,
        popularity,
        poster_path,
        release_date,
        vote_average,
        genre_ids,
      }) => {
        const genresNames = getGenresById(genre_ids);
        const defaultImageUrl = new URL('../images/film.jpg', import.meta.url);
        const imgUrl = poster_path
          ? `https://image.tmdb.org/t/p/w200${poster_path}`
          : `${defaultImageUrl.href}`;
        return `<li class="movie-card"  id="${id}">
    <img data-src="${imgUrl}" src="${imgUrl}" alt="${title}" class="lazyload  movie-card__img">
    <p class="movie-card__title">${title}</p>
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
