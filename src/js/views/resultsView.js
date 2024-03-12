import icon from 'url:../../img/icons.svg'; // loading static file icons.svg
import View from './View.js';
import PreviewView from './previewView.js';

class resultsView extends PreviewView {
  _parentElement = document.querySelector('.results');
}

export default new resultsView();
