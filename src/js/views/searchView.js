class SearchView {
  _parentElement = document.querySelector('.search');

  _clearSearchInput() {
    this._parentElement.querySelector(`.search__field`).value = ``;
  }

  getSearchQuery() {
    const searchQuery =
      this._parentElement.querySelector(`.search__field`).value;
    this._clearSearchInput();
    return searchQuery;
  }

  addHandlerSearch(handlerFunc) {
    this._parentElement.addEventListener(`submit`, e => {
      e.preventDefault();
      handlerFunc();
    });
  }
}

export default new SearchView();
