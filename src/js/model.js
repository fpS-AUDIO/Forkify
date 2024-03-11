import 'regenerator-runtime/runtime'; // for polyfilling async function (old browser support)
import * as cfg from './config.js';
import * as hlp from './halpers.js';

export const state = {
  recipe: {},
  search: {
    query: ``,
    results: [],
    page: 1,
    resultsPerPage: cfg.RESULTS_PER_PAGE,
  },
};

export const loadRecipe = async function (idRecipe) {
  try {
    // AJAX call helper function to get recipe data
    const dataResponse = await hlp.getJSON(`${cfg.REQUEST_URL}/${idRecipe}`);

    // update state: change recipe{}
    state.recipe = {
      id: dataResponse.data.recipe.id,
      title: dataResponse.data.recipe.title,
      imageUrl: dataResponse.data.recipe.image_url,
      servings: dataResponse.data.recipe.servings,
      cookingTime: dataResponse.data.recipe.cooking_time,
      ingredients: dataResponse.data.recipe.ingredients,
      publisher: dataResponse.data.recipe.publisher,
      sourceUrl: dataResponse.data.recipe.source_url,
    };
  } catch (err) {
    // re-throwing error to make it propage to the controller
    throw err;
  }
};

export const searchRecipe = async function (query) {
  try {
    // update state query
    state.search.query = query;

    // AJAX call for searching query
    const dataResponse = await hlp.getJSON(
      `${cfg.REQUEST_URL}?search=${query}`
    );

    // update state serach results
    state.search.results = dataResponse.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        imageUrl: recipe.image_url,
        publisher: recipe.publisher,
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  /* ----- FORMULA:
  const startOfArray = (page - 1) * resultPerPage;
  const endOfArray = page * resultPerPage;
  const resultPage = arrayResults.slice(startOfArray, endOfArray);
  */
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  // simply return the sliced full array of results
  return state.search.results.slice(start, end);
};

export const updateServingsNum = function (newServings) {
  // newQuantity = oldQuantity * newServings / oldServing
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  // Also update the actual servings to newServings
  state.recipe.servings = newServings;
};
