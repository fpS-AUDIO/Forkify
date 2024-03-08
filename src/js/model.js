import 'regenerator-runtime/runtime'; // for polyfilling async function (old browser support)
import * as cfg from './config.js';
import * as hlp from './halpers.js';

export const state = {
  recipe: {},
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
    alert(err);
  }
};