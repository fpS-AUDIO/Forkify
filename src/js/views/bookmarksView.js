import icon from 'url:../../img/icons.svg'; // loading static file icons.svg
import View from './View.js';
import PreviewView from './previewView.js';

class BookmarksView extends PreviewView {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yet adde. Try to add one :)`;
}

export default new BookmarksView();
