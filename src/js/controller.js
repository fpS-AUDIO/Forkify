// ----- imports ----- //
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable'; // for polyfilling (old browser support)
import 'regenerator-runtime/runtime'; // for polyfilling async function (old browser support)

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    // get the hash from URL (location.hash) and get the id from it by removing `#`
    const idRecipe = location.hash.slice(1);
    if (!idRecipe) return; // guard clause to check if there any id

    // view: render loading spinner
    recipeView.renderLoadingSpinner();

    // updating the result view to mark the selected search result
    resultsView.update(model.getSearchResultsPage());

    // model: loading recipe (await before move the execution)
    await model.loadRecipe(idRecipe);
    
    // rendering recipe (gonna be a separated function)
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(err);
  }
};

const controlSearch = async function () {
  try {
    // get search query
    const searchQuery = searchView.getSearchQuery();
    if (!searchQuery) return;

    // search for recipe basing on query
    await model.searchRecipe(searchQuery);

    // render search results
    resultsView.render(model.getSearchResultsPage());

    // render pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
    recipeView.renderError(err);
  }
};

const controlPagination = function (goTo) {
  // update the current page
  model.state.search.page = goTo;
  // render NEW search results
  resultsView.render(model.getSearchResultsPage(goTo));
  // render NEW pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update recipe serving
  model.updateServingsNum(newServings);
  // update the recipe view
  recipeView.update(model.state.recipe);
};

// ----- entry point ----- //
init = function () {
  // subscriber to views publishers
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandlerPagination(controlPagination);
};

init();
