import * as model from './model.js';
import {MODAL_CLOSE_SEC} from './views/config.js'
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js'
import paginationView from './views/paginationView.js';

// import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './views/config.js';

if(module.hot) {
  module.hot.accept();
}
///////////////////////////////////////

const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);

    if(!id) return;
    //Loading recipe
    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage())
    bookmarkView.update(model.state.bookmark)
    await model.loadRecipe(id);
    
    
    //2) rendering recipe 
    recipeView.render(model.state.recipe);
    
  
  } catch(error) {
    recipeView.renderError();
    console.log(error);
  }
}

const controlSearchResults = async function(){
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if(!query) return

    await model.loadSearchResults(query);

    
    resultsView.render(model.getSearchResultsPage());


    paginationView.render(model.state.search)
  } catch(error){
    throw error;
  }
}

const controlPagination = function(goTopAGE) {
  resultsView.render(model.getSearchResultsPage(goTopAGE));


    paginationView.render(model.state.search)
}

const controlServings = function(newServings){
  //update the recipe servings (in state)
  model.updateServings(newServings);


  //recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe);
  //update the recipe view
}

const controlAddBookmark = function() {

  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  
  recipeView.update(model.state.recipe)

  bookmarkView.render(model.state.bookmark)
}

const controlBookmark = function() {
  bookmarkView.render(model.state.bookmark)
}

const controlAddRecipe = async function(newRecipe) {
  try {
    addRecipeView.renderSpinner()

    await model.uploadRecipe(newRecipe)
    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    bookmarkView.render(model.state.bookmark);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function(){
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000);
  } catch(err){
    console.error(err);
    addRecipeView.renderError(err.message)
  }
}

const init =  function() {
bookmarkView.addHandlerRender(controlBookmark);
recipeView.addHandlerRender(controlRecipes);
recipeView.addHandlerUpdateServings(controlServings);
recipeView.addHandlerAddBookmark(controlAddBookmark)
searchView.addHandlerSearch(controlSearchResults);
paginationView.addHandlerClick(controlPagination);
addRecipeView.addHandlerUpload(controlAddRecipe);
}
init()
//handling multiple events on same function


// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes)