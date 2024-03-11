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

  // updates only text and attributes in DOM
  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();

    // indeed update _data (state)
    this._data = data;
    // as if we want to render new markup we need the new markup to compare it with the old markup
    const newMarkup = this._generateMarkup();

    // ALGORITHM TO UPDATE DOM:
    // ========================
    // converting the newMarkup (string) to a DOM Object:
    //  - document.createRange() returns range
    //  - range.createContextualFragment() converts html string to the real DOM object
    const virtualDOM = document
      .createRange()
      .createContextualFragment(newMarkup);

    // selecting the NodeList of all elements of virtual DOM and converting it into a real array
    const newElements = Array.from(virtualDOM.querySelectorAll(`*`));

    // selecting also all current elements of DOM to compare them and converting it into a real array
    const currentElements = Array.from(
      this._parentElement.querySelectorAll(`*`)
    );

    // comparing the 2 arrays of elements
    // looping over the the array of new elements
    newElements.forEach((newEl, indx) => {
      // selecting the same old element (which is actual on the page)
      const oldEl = currentElements[indx];

      // SOME THEORY:
      // nodeElement1.isEqualNode(nodeElement2) returns true if both node elements are the same
      // nodeElement.nodeValue is property which returns content of text node (string) or null if it's other type of node (element)
      // nodeElement.FirstChild is property the node which actually contains the text (text node)
      // nodeElement.attributyes is property which returns NamedNodeMap (object) whoch contains all attributes
      // nodeElement.setAttribute(nameAttr, valueAttr)

      // if (!newEl.isEqualNode(oldEl))                  -> newEl is different from oldEl
      //    &&
      // if (newEl.firstChild.nodeValue.trim() !== ``)   -> `trimmed` text content of text node should not be empty
      //                                                  using optional chaining because firstChild might not always exists

      // updates changed text (on elements which contains text directly)
      if (
        !newEl.isEqualNode(oldEl) &&
        newEl.firstChild?.nodeValue.trim() !== ``
      ) {
        // update text content of text nodes
        oldEl.textContent = newEl.textContent;
      }

      // updates changed attributes
      if (!newEl.isEqualNode(oldEl)) {
        // converting attributes object of changed elements to an array
        // then loop that array and change the value of all attrbiutes
        Array.from(newEl.attributes).forEach(attribute => {
          oldEl.setAttribute(attribute.name, attribute.value);
        });
      }
    });
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
