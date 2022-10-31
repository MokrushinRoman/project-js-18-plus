const loader = document.querySelector('.loader');

export function hideLoader() {
  loader.classList.add('is-hidden');
}

export function showLoader() {
  loader.classList.remove('is-hidden');
}
