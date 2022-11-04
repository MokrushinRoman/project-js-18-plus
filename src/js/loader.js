const loader = document.querySelector('.loader');
const blocker = document.querySelector('.blocker');
// const blocker2 = document.querySelector('#blocker');

export function hideLoader() {
  loader.classList.add('is-hidden');
  blocker?.classList.add('is-hidden');
  // blocker2?.className = 'blocker is-hidden'
}

export function showLoader() {
  // debugger;
  loader.classList.remove('is-hidden');
  blocker?.classList.remove('is-hidden');
  // blocker2.className = 'blocker';
}
