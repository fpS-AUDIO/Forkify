import 'regenerator-runtime/runtime'; // for polyfilling async function (old browser support)
import * as cfg from './config.js';
import * as hlp from './halpers.js';

export const state = {
  bookmarks: [],
  recipe: {},
  search: {
    query: ``,
    results: [],
    page: 1,
    resultsPerPage: cfg.RESULTS_PER_PAGE,
  },
};

const creatRecipeObj = function (data) {
  return {
    id: data.data.recipe.id,
    title: data.data.recipe.title,
    imageUrl: data.data.recipe.image_url,
    servings: data.data.recipe.servings,
    cookingTime: data.data.recipe.cooking_time,
    ingredients: data.data.recipe.ingredients,
    publisher: data.data.recipe.publisher,
    sourceUrl: data.data.recipe.source_url,
    // use short circuiting (&&) so if :
    // `data.data.recipe.key` is false ->  do nothing
    // `data.data.recipe.key` is true ->   create object and spread it inside the main recipe obj
    ...(data.data.recipe.key && { key: data.data.recipe.key }),
  };
};

const localStoreBookmarks = function () {
  const bookmarksStringified = JSON.stringify(state.bookmarks);
  localStorage.setItem(`bookmarks`, bookmarksStringified);
};

export const getLocalBookmarks = function () {
  const bookmarksStringified = localStorage.getItem(`bookmarks`);
  if (bookmarksStringified) {
    state.bookmarks = JSON.parse(bookmarksStringified);
  }
};

export const loadRecipe = async function (idRecipe) {
  try {
    // AJAX call helper function to get recipe data
    const dataResponse = await hlp.getJSON(
      `${cfg.REQUEST_URL}/${idRecipe}?key=${cfg.API_KEY}`
    );

    // update state: change recipe{}
    state.recipe = creatRecipeObj(dataResponse);

    if (state.bookmarks.some(recipe => recipe.id === state.recipe.id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked === false;
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
      `${cfg.REQUEST_URL}?search=${query}&key=${cfg.API_KEY}`
    );

    // update state serach results
    state.search.results = dataResponse.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        imageUrl: recipe.image_url,
        publisher: recipe.publisher,
        ...(recipe.key && { key: recipe.key }),
      };
    });

    // reset page after search
    state.search.page = 1;
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

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  state.recipe.bookmarked = true;
  localStoreBookmarks();
};

export const removeBookmark = function (id) {
  const indexRecipe = state.bookmarks.findIndex(recipe => recipe.id === id);
  if (indexRecipe !== -1) {
    state.bookmarks.splice(indexRecipe, 1);
    state.recipe.bookmarked = false;
  }
  localStoreBookmarks();
};

export const uploadNewRecipe = async function (recipeData) {
  try {
    // creating ingredients array formatted like in App
    const ingredientsArr = Object.entries(recipeData).filter(entry => {
      return entry[0].startsWith(`ingredient`) && entry[1] !== ``;
    });
    const ingredientsObj = ingredientsArr.map(ingr => {
      ingrArray = ingr[1].replaceAll(` `, ``).split(`,`);
      if (!ingrArray.length === 3)
        throw new Error(`Wrong Ingredients format...`);
      const [quantity, unit, description] = ingrArray;
      return { quantity: quantity ? +quantity : null, unit, description };
    });

    // creating recipe object formatted like in API
    const recipeToUpload = {
      title: recipeData.title,
      image_url: recipeData.image,
      servings: +recipeData.servings,
      cooking_time: +recipeData.cookingTime,
      publisher: recipeData.publisher,
      source_url: recipeData.sourceUrl,
      ingredients: ingredientsObj,
    };

    // make AJAX call
    const uploadResponse = await hlp.sendJSON(
      `${cfg.REQUEST_URL}?key=${cfg.API_KEY}`,
      recipeToUpload
    );

    // transofrm recipe in application formatted style object
    const createdRecipe = creatRecipeObj(uploadResponse);

    // update state
    state.recipe = createdRecipe;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
