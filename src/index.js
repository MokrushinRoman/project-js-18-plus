import { Pagination } from 'tui-pagination';


const options = {
    totalItems: 40,
    itemsPerPage: 2,
    visiblePages: 7,
    page: 1,
    centerAlign: false,
    firstItemClassName: 'tui-first-child',
    lastItemClassName: 'tui-last-child',
    template: {
      page: '<a href="#" class="tui-page-btn tui-pagination">{{page}}</a>',
      currentPage: '<strong class="tui-page-btn tui-pagination tui-is-selected">{{page}}</strong>',
      moveButton:
        '<a href="#" class="tui-page-btn tui-pagination tui-{{type}}">' +
          '<span class="tui-ico-{{type}}">{{type}}</span>' +
        '</a>',
      disabledMoveButton:
        '<span class="tui-page-btn tui-pagination tui-is-disabled tui-{{type}}">' +
          '<span class="tui-ico-{{type}}">{{type}}</span>' +
        '</span>',
      moreButton:
        '<a href="#" class="tui-page-btn tui-pagination tui-{{type}}-is-ellip">' +
          '<span class="tui-ico-ellip">...</span>' +
        '</a>'
    }
  };
  


// let totalPages = 0;
// let page = 1;
// let itemsPerPage = 20;
// let timeWindow = 'day';
const container = document.getElementById('pagination-container');
const instance = new window.tui.Pagination(container, options);
console.log(instance);
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

pagination.on('beforeMove', evt => {
    const {page} = evt;
    const result = movies(`${page}`);

    if (result) {
        pagination.movePageTo(page);
    } else {
        return false;
    }
});

pagination.on('afterMove', ({page}) => console.log(page));
;


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
      return movieCards;
    }
  );
  console.log('document.querySelector ', document);
  document.querySelector('.movie-list').innerHTML = result;
};
movies();

