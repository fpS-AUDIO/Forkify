import icon from 'url:../../img/icons.svg'; // loading static file icons.svg
import View from './View.js';

class paginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    // get the current page and the total of pages
    const currentPage = this._data.page;
    const numberPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    /* ----- possible scenarios: 
    
    Scenario 1: On the first page, there are more pages ahead
        (currentPage === 1 && numberPages > 1)

    Scenario 2: Middle pages, not the first or the last one
        (currentPage > 1 && currentPage < numberPages)

    Scenario 3: On the last page
        (currentPage === numberPages && numberPages > 1)

    Scenario 4: There is only one page, or none, so no buttons are needed
    */

    // Scenario #1
    if (currentPage === 1 && numberPages > 1) {
      return this._generateMarkupButtonNext(currentPage);
    }

    // Scenario #2
    if (currentPage > 1 && currentPage < numberPages) {
      return `${this._generateMarkupButtonPrev(
        currentPage
      )} ${this._generateMarkupButtonNext(currentPage)}`;
    }

    // Scenario #3
    if (currentPage === numberPages && numberPages > 1) {
      return this._generateMarkupButtonPrev(currentPage);
    }

    // Scenario #4
    return ``;
  }

  _generateMarkupButtonPrev(currentPage) {
    return `
    <button data-goto="${
      currentPage - 1
    }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icon}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currentPage - 1}</span>
    </button>
    `;
  }

  _generateMarkupButtonNext(currentPage) {
    return `
    <button data-goto="${
      currentPage + 1
    }" class="btn--inline pagination__btn--next">
        <span>Page ${currentPage + 1}</span>
        <svg class="search__icon">
            <use href="${icon}#icon-arrow-right"></use>
        </svg>
    </button>
    `;
  }

  addHandlerPagination(subscriberFn) {
    this._parentElement.addEventListener(`click`, e => {
      // select button (origin of event)
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      // get the data attribute (go to page) of button and transform to number
      const goto = +btn.dataset.goto;

      // passing the goto attribute to the subscriber (in controller)
      subscriberFn(goto);
    });
  }
}

export default new paginationView();
