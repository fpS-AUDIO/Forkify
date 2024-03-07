// ----- imports ----- //

import 'core-js/stable'; // for polyfilling (old browser support)
import 'regenerator-runtime/runtime'; // for polyfilling async function (old browser support)
import icon from 'url:../img/icons.svg'; // loading static file icons.svg

// ----- elements ----- //

const recipeContainer = document.querySelector('.recipe');

// ----- functions ----- //

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// function to render loading spinner inside the given container
const renderLoadingSpinner = function (parentElement) {
  const spinnerHtml = `
    <div class="spinner">
      <svg>
        <use href="${icon}.svg#icon-loader"></use>
      </svg>
    </div>
  `;
  parentElement.innerHTML = ``;
  parentElement.insertAdjacentHTML(`afterbegin`, spinnerHtml);
};

const getRecipe = async function () {
  try {
    renderLoadingSpinner(recipeContainer);

    // AJAX call for recipes
    const response = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886`
    );
    const dataResponse = await response.json();

    // guard clause to check response
    if (!response.ok)
      throw new Error(`Something went wrong: ${dataResponse.message}`);

    // creating recipe object and changing the key names to camelCase standard
    let { recipe } = dataResponse.data;
    recipe = {
      id: recipe.id,
      title: recipe.title,
      imageUrl: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
    };

    // rendering reciper (gonna be a separated function)
    const recipeHtml = `
          <figure class="recipe__fig">
            <img src="${recipe.imageUrl}" alt="${
      recipe.title
    }" class="recipe__img" />
            <h1 class="recipe__title">
              <span>${recipe.title}</span>
            </h1>
          </figure>

          <div class="recipe__details">
            <div class="recipe__info">
              <svg class="recipe__info-icon">
                <use href="${icon}#icon-clock"></use>
              </svg>
              <span class="recipe__info-data recipe__info-data--minutes">${
                recipe.cookingTime
              }</span>
              <span class="recipe__info-text">minutes</span>
            </div>
            <div class="recipe__info">
              <svg class="recipe__info-icon">
                <use href="${icon}#icon-users"></use>
              </svg>
              <span class="recipe__info-data recipe__info-data--people">${
                recipe.servings
              }</span>
              <span class="recipe__info-text">servings</span>

              <div class="recipe__info-buttons">
                <button class="btn--tiny btn--increase-servings">
                  <svg>
                    <use href="${icon}#icon-minus-circle"></use>
                  </svg>
                </button>
                <button class="btn--tiny btn--increase-servings">
                  <svg>
                    <use href="${icon}#icon-plus-circle"></use>
                  </svg>
                </button>
              </div>
            </div>

            <div class="recipe__user-generated">
              <svg>
                <use href="${icon}#icon-user"></use>
              </svg>
            </div>
            <button class="btn--round">
              <svg class="">
                <use href="${icon}#icon-bookmark-fill"></use>
              </svg>
            </button>
          </div>

          <div class="recipe__ingredients">
            <h2 class="heading--2">Recipe ingredients</h2>
            <ul class="recipe__ingredient-list">

            ${recipe.ingredients
              .map(ingredient => {
                return `<li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icon}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${ingredient.quantity}</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ingredient.unit}</span>
                ${ingredient.description}
              </div>
            </li>`;
              })
              .join('')}

              <li class="recipe__ingredient">
                <svg class="recipe__icon">
                  <use href="${icon}#icon-check"></use>
                </svg>
                <div class="recipe__quantity">1000</div>
                <div class="recipe__description">
                  <span class="recipe__unit">g</span>
                  pasta
                </div>
              </li>

            </ul>
          </div>

          <div class="recipe__directions">
            <h2 class="heading--2">How to cook it</h2>
            <p class="recipe__directions-text">
              This recipe was carefully designed and tested by
              <span class="recipe__publisher">${
                recipe.publisher
              }</span>. Please check out
              directions at their website.
            </p>
            <a
              class="btn--small recipe__btn"
              href="${recipe.sourceUrl}"
              target="_blank"
            >
              <span>Directions</span>
              <svg class="search__icon">
                <use href="${icon}#icon-arrow-right"></use>
              </svg>
            </a>
          </div>`;

    recipeContainer.innerHTML = ``;
    recipeContainer.insertAdjacentHTML(`afterbegin`, recipeHtml);
  } catch (err) {
    alert(err.message);
  }
};
getRecipe();
