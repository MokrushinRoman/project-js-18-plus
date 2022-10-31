import { Pagination } from 'tui-pagination';
import { getTrending } from './filmsApi';
import './js/myLibrary';


// const options = {
//     totalItems: 40,
//     itemsPerPage: 2,
//     visiblePages: 7,
//     page: 1,
//     centerAlign: false,
//     firstItemClassName: 'tui-first-child',
//     lastItemClassName: 'tui-last-child',
//     template: {
//       page: '<a href="#" class="tui-page-btn tui-pagination">{{page}}</a>',
//       currentPage: '<strong class="tui-page-btn tui-pagination tui-is-selected">{{page}}</strong>',
//       moveButton:
//         '<a href="#" class="tui-page-btn tui-pagination tui-{{type}}">' +
//           '<span class="tui-ico-{{type}}">{{type}}</span>' +
//         '</a>',
//       disabledMoveButton:
//         '<span class="tui-page-btn tui-pagination tui-is-disabled tui-{{type}}">' +
//           '<span class="tui-ico-{{type}}">{{type}}</span>' +
//         '</span>',
//       moreButton:
//         '<a href="#" class="tui-page-btn tui-pagination tui-{{type}}-is-ellip">' +
//           '<span class="tui-ico-ellip">...</span>' +
//         '</a>'
//     }
//   };
  


// // let totalPages = 0;
// // let page = 1;
// // let itemsPerPage = 20;
// // let timeWindow = 'day';
// const container = document.getElementById('pagination-container');
// const instance = new window.tui.Pagination(container, options);
// console.log(instance);
// const card = ({
//   imgUrl,
//   title,
//   id,
// }) => `<li id=""${id} class="movie-list__item movie">
//     <img
// 		class="movie__img"
//       src=${imgUrl ? `https://image.tmdb.org/t/p/w200${imgUrl} ` : ''}
//       alt="${title}"
//       loading="lazy"
//     />
//     <MovieTittle title={title}>${title}</MovieTittle>
// </li>`;

// pagination.on('beforeMove', evt => {
//     const {page} = evt;
//     const result = movies(`${page}`);

//     if (result) {
//         pagination.movePageTo(page);
//     } else {
//         return false;
//     }
// });

// pagination.on('afterMove', ({page}) => console.log(page));
// ;


// const movies = async () => {
//   const result = await getTrending({ timeWindow, page, itemsPerPage }).then(
//     ({ results, total_pages }) => {
//       totalPages = total_pages;
//       const movieCards = results
//         .map(
//           ({
//             title = '',
//             name = '',
//             poster_path,

//             id,
//           }) =>
//             card({
//               title: title ? title : name,
//               imgUrl: poster_path,
//               id,
//             })
//         )
//         .join('');
//       return movieCards;
//     }
//   );
//   console.log('document.querySelector ', document);
//   document.querySelector('.movie-list').innerHTML = result;
// };
// movies();




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

function PaginationButton(totalPages, maxPagesVisible = 10, currentPage = 1) {
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
      handleClick(e);
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
  
  this.render = (container = document.body) => {
    container.appendChild(paginationButtonContainer);
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

const paginationButtons = new PaginationButton(20, 5);

paginationButtons.render();

paginationButtons.onChange(e => {
  console.log('-- changed', e.target.value)
});
