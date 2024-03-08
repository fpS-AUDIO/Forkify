// ----- imports ----- //
import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/stable'; // for polyfilling (old browser support)
import 'regenerator-runtime/runtime'; // for polyfilling async function (old browser support)

// ----- functions ----- //



// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

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
    alert(err.message);
  }
};

// ----- event listeners ----- //

// looping over events: when selecting a recipe (changes hash) or loading the page with hash inside the URL
[`load`, `hashchange`].forEach(event =>
  window.addEventListener(event, controlRecipes)
);
