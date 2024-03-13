// ----- imports ----- //
import * as model from './model.js';
import * as cfg from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

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
    // update bookmars view
    bookmarksView.update(model.state.bookmarks);

    // model: loading recipe (await before move the execution)
    await model.loadRecipe(idRecipe);

    // rendering recipe (gonna be a separated function)
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(err);
    console.log(err);
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

const controlBookmarks = function () {
  // add or remove the bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  // update recipe view
  recipeView.update(model.state.recipe);

  // render bookmars view
  bookmarksView.render(model.state.bookmarks);
};

const loadBookmarks = function () {
  // load the bookmarks from local storage
  model.getLocalBookmarks();

  // render bookmarks in view bookmarks view
  bookmarksView.render(model.state.bookmarks);
};

const controlNewRecipe = async function (recipeData) {
  try {
    // show loading spinner
    addRecipeView.renderLoadingSpinner();

    // upload handled by model
    await model.uploadNewRecipe(recipeData);

    // add recipe to bookmarks
    model.addBookmark(model.state.recipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // show success message
    addRecipeView.renderMessage();

    // render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change id in url
    window.history.pushState(null, ``, `#${model.state.recipe.id}`);

    // also close after submitting
    setTimeout(() => {
      addRecipeView._showHideAddRecipe();
    }, cfg.CLOSE_FORM_SECONDS * 1000);
  } catch (err) {
    addRecipeView.renderError(`There was an error uploading your recipe`);
    console.log(err);
  }
};

// ----- entry point ----- //
init = function () {
  // subscriber to views publishers
  addRecipeView.addHandlerGetRecipe(controlNewRecipe);
  recipeView.addHandlerLoadBookmarks(loadBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerUpdateBoormarks(controlBookmarks);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandlerPagination(controlPagination);
};

init();
