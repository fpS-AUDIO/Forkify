import icon from 'url:../../img/icons.svg'; // loading static file icons.svg
import View from './View.js';

class AddRecipeView extends View {
  _message = `Your recipe was successfully added!`;
  _parentElement = document.querySelector('.upload');
  _closeBtn = document.querySelector(`.btn--close-modal`);
  _openBtn = document.querySelector(`.nav__btn--add-recipe`);
  _overlay = document.querySelector(`.overlay`);
  _newRecipeWindow = document.querySelector(`.add-recipe-window`);

  constructor() {
    super();
    // event listener to open
    this._openBtn.addEventListener(`click`, this._showHideAddRecipe.bind(this));

    // event listeners to close
    [this._overlay, this._closeBtn].forEach(el => {
      el.addEventListener(`click`, this._showHideAddRecipe.bind(this));
    });
  }

  _showHideAddRecipe = function () {
    [this._overlay, this._newRecipeWindow].forEach(el =>
      el.classList.toggle(`hidden`)
    );
  };

  addHandlerGetRecipe(subscriberFn) {
    this._parentElement.addEventListener(`submit`, e => {
      e.preventDefault();
      // get the form object and obtain an array by spreading it
      const dataArray = [...new FormData(this._parentElement)];
      // convert to actual array from dataArray (has entries structure)
      const dataObj = Object.fromEntries(dataArray);
      // handled by controller
      subscriberFn(dataObj);
    });
  }
}

export default new AddRecipeView();
