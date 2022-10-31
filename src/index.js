import PaginationButton from "./js/pagination.js";


const paginationButtons = new PaginationButton(20, 5);

paginationButtons.render();

paginationButtons.onChange(e => {
  console.log('-- changed', e.target.value)
});