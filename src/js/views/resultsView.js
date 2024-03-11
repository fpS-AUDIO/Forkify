import icon from 'url:../../img/icons.svg'; // loading static file icons.svg
import View from './View.js';

class resultsView extends View {
  _parentElement = document.querySelector('.results');

  _generateMarkup() {
    return this._data
      .map(result => this._generateMarkupResult(result))
      .join(``);
  }

  _generateMarkupResult(result) {
    const currentId = window.location.hash.slice(1);

    return `
    <li class="preview">
        <a class="preview__link ${
          currentId === result.id ? `preview__link--active` : ``
        } "  href="#${result.id}">
            <figure class="preview__fig">
                <img src="${result.imageUrl}" alt="Test" />
            </figure>
            <div class="preview__data">
                <h4 class="preview__title">${result.title}</h4>
                <p class="preview__publisher">${result.publisher}</p>
            </div>
        </a>
    </li>
    `;
  }
}

export default new resultsView();
