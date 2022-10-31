(() => {
    const refs = {
      openModalBtn: document.querySelector(".footer__link"),
      closeModalBtn: document.querySelector("[data-students-modal-close]"),
      modal: document.querySelector("[data-students-modal]"),
      body: document.querySelector("body"),
    };
  
    refs.openModalBtn.addEventListener("click", toggleModal);
    refs.closeModalBtn.addEventListener("click", toggleModal);
  
    function toggleModal() {
      refs.modal.classList.toggle("is-hidden");
      refs.body.classList.toggle("no-scroll");
    }
  })();