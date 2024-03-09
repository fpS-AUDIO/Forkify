// ----- imports ----- //
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';

import 'core-js/stable'; // for polyfilling (old browser support)
import 'regenerator-runtime/runtime'; // for polyfilling async function (old browser support)

const controlRecipes = async function () {
  try {
    // get the hash from URL (location.hash) and get the id from it by removing `#`
    const idRecipe = location.hash.slice(1);
    if (!idRecipe) return; // guard clause to check if there any id

    // view: render loading spinner
    recipeView.renderLoadingSpinner();

    // model: get recipe (await before move the execution)
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
    console.log(model.state.search.results);
  } catch (err) {
    console.log(err);
    recipeView.renderError(err);
  }
};

// ----- entry point ----- //
init = function () {
  // subscriber to views publishers
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearch);
};
init();
