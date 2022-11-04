const loader = document.querySelector('.loader');
const blocker = document.querySelector('.blocker');

export function hideLoader() {
  loader.classList.add('is-hidden');
  blocker?.classList.add('is-hidden');
}

export function showLoader() {
  loader.classList.remove('is-hidden');
  blocker?.classList.remove('is-hidden');
}
