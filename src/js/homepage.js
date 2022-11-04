import { movies } from '../index.js';
import { onWatchedBtnClick } from './myLibrary';

const refs = {
  bgHeader: document.getElementById('bg'),
  logo: document.querySelector('.header__logo--text'),
  home: document.querySelector('#button__home'),
  library: document.querySelector('#button__library'),
  btnList: document.querySelector('.library__btn-list'),
  form: document.querySelector('.search__form'),
  search: document.querySelector('.search__form_button'),
  movieList: document.querySelector('.movie-list'),
  libraryListError: document.querySelector('.library-list__error'),
};

onHome();

function onHome() {
  refs.home.addEventListener('click', onClickBtn);
  refs.library.addEventListener('click', onClickBtn);
  // refs.form.addEventListener('submit', onSubmit);
}

export function onClickBtnHome() {
  refs.libraryListError.innerText = '';
  refs.libraryListError.style.display = 'none';

  refs.bgHeader?.classList.remove('header__library');
  refs.form.style.display = 'flex';
  refs.btnList.style.display = 'none';
  refs.bgHeader?.classList.add('header__home');
  refs.library.classList.remove('navigation__button--active');
  refs.home.classList.add('navigation__button--active');

  movies({ page: 1 });
}

function onClickBtnLibrary() {
  refs.movieList.innerText = '';
  refs.bgHeader.classList.add('header__library');
  refs.form.style.display = 'none';
  refs.btnList.style.display = 'flex';
  refs.home.classList.remove('navigation__button--active');
  refs.library.classList.add('navigation__button--active');
  refs.bgHeader.classList.remove('header__home');
}

function onSubmit(event) {
  event.preventDefault();
  const query = event.currentTarget.elements.search.value;
}

function onClickBtn(event) {
  if (event.target === refs.library) {
    onClickBtnLibrary();
    onWatchedBtnClick();
  } else if (event.target === refs.home || event.target === refs.logo) {
    onClickBtnHome();
    // getTrending().then(data => {
    //   refs.movieList.innerHTML = movieListMarkup(data.results);
    // });

    // ||

    //   movies();
  }
}
