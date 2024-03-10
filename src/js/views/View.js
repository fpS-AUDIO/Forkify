import icon from 'url:../../img/icons.svg'; // loading static file icons.svg

export default class View {
  _data;
  _errorMessage = `We could not find the recipe. Please try another one!`;
  _message = `HELLO' I'm TEMP MESSAGE`;

  _clearContainer() {
    this._parentElement.innerHTML = ``;
  }

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    
    this._data = data;
    const markup = this._generateMarkup();
    this._clearContainer();
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }

  renderLoadingSpinner() {
    const spinnerHtml = `
      <div class="spinner">
        <svg>
          <use href="${icon}.svg#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clearContainer();
    this._parentElement.insertAdjacentHTML(`afterbegin`, spinnerHtml);
  }

  renderError(message = this._errorMessage) {
    const errorMarkup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icon}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>No recipes found for your query. Please try again!</p>
    </div>
    `;
    this._clearContainer();
    this._parentElement.insertAdjacentHTML(`afterbegin`, errorMarkup);
  }

  renderMessage(message = this._message) {
    const messageMarkup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icon}#icon-smile"></use>
        </svg>
      </div>
      <p>Start by searching for a recipe or an ingredient. Have fun!</p>
    </div>
    `;
    this._clearContainer();
    this._parentElement.insertAdjacentHTML(`afterbegin`, messageMarkup);
  }
}
