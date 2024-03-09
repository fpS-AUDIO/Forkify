class SearchView {
  #parentElement = document.querySelector('.search');

  #clearSearchInput() {
    this.#parentElement.querySelector(`.search__field`).value = ``;
  }

  getSearchQuery() {
    const searchQuery =
      this.#parentElement.querySelector(`.search__field`).value;
    this.#clearSearchInput();
    return searchQuery;
  }

  addHandlerSearch(handlerFunc) {
    this.#parentElement.addEventListener(`submit`, e => {
      e.preventDefault();
      handlerFunc();
    });
  }
}

export default new SearchView();
