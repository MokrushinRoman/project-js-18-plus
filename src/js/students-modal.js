 (() => {
  const refs = {
    openModalBtn: document.querySelector(".footer__link"),
    closeModalBtn: document.querySelector("[data-students-modal-close]"),
    modal: document.querySelector("[data-students-modal]"),
    body: document.querySelector("body"),
    backdrop: document.querySelector(".backdrop"),
  };
  
  refs.openModalBtn.addEventListener("click", toggleModal);
  refs.closeModalBtn.addEventListener("click", toggleModal);
  refs.backdrop.addEventListener("click", onBackdropClick);
  
  function toggleModal() {
    window.addEventListener("keydown", onEscKeyPress);
    refs.modal.classList.toggle("is-hidden");
    refs.body.classList.toggle("no-scroll");
  }
  function onBackdropClick(e) {
    if (e.currentTarget === e.target) {
      toggleModal();
    }
  }
  function onEscKeyPress(e) {
    if (e.code === 'Escape') {
      toggleModal();
    }
  }

  }) ()