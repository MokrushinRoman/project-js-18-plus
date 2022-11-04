(() => {
  const refs = {
    openModalBtn: document.querySelector('.footer__link'),
    closeModalBtn: document.querySelector('[data-students-modal-close]'),
    modal: document.querySelector('[data-students-modal]'),
    body: document.querySelector('body'),
    backdrop: document.querySelector('.backdrop__students-modal'),
  };

  refs.openModalBtn.addEventListener('click', onOpenModal);
  refs.closeModalBtn.addEventListener('click', onCloseModal);
  refs.backdrop.addEventListener('click', onBackdropClick);

  function onOpenModal() {
    window.addEventListener('keydown', onEscKeyPress);
    refs.modal.classList.remove('hide');
    refs.body.classList.add('no-scroll');
  }

  function onCloseModal() {
    window.addEventListener('keydown', onEscKeyPress);
    refs.modal.classList.add('hide');
    refs.body.classList.remove('no-scroll');
  }

  function onBackdropClick(e) {
    if (e.currentTarget === e.target) {
      onCloseModal();
    }
  }
  function onEscKeyPress(e) {
    if (e.code === 'Escape') {
      onCloseModal();
    }
  }
})();
