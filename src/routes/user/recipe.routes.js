/**
 * * User Recipe Routes
 */

import { Router } from 'express';
import * as recipeController from '../../controllers/user/recipe.controller';

import { appAuthMiddleware } from '../../middleware/authentication';
import { validate } from '../../validator/user/recipe.validator';
import { constants as VALIDATOR } from '../../constant/validator/recipe';

import { validateRating } from '../../validator/user/rating.validator';
import { constants as VALIDATOR_RATING } from '../../constant/validator/rating';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  CHEF: '/chef',
  LIST: '/list',
  RATING: '/rating',
  TOP: '/top',
  RECIPE_OPTIONS: '/options',
  SEARCH: '/search',
  SEARCH_ALL: '/search/all',
};

routes
  .route(PATH.CHEF)
  /**
   * @api {GET} /api/user/recipe/chef?chef_id=
   * @desc Get Chefs recipe
   * @access Public
   * **/
  .get(validate(VALIDATOR.CHEF_ID), recipeController.getChefRecipes);

routes
  .route(PATH.LIST)
  /**
   * @api {GET} /api/user/recipe/list
   * @desc Get All recipes
   * @access Public
   * **/
  .get(recipeController.getAllRecipes);

routes
  .route(PATH.ROOT)
  /**
   * @api {GET} /api/user/recipe?recipe_id=
   * @desc Get Recipes Details
   * @access Public
   * **/
  .get(recipeController.getRecipeDetails);

routes
  .route(PATH.TOP)
  /**
   * @api {GET} /api/user/chef/TOP
   * @desc Get Top Chefs
   * @access Public
   * **/
  .get(recipeController.topRecipeList);

routes
  .route(PATH.RECIPE_OPTIONS)
  /**
   * @api {GET} /api/user/recipe/options
   * @desc Get All recipe options
   * @access Public
   * **/
  .get(recipeController.getRecipeOptions);

routes
  .route(PATH.SEARCH)
  /**
   * @api {GET} /api/user/recipe/search
   * @desc Search Recipe by options
   * @access Public
   * **/
  .get(recipeController.searchRecipeByOptions);

routes
  .route(PATH.SEARCH_ALL)
  /**
   * @api {GET} /api/user/recipe/search/all
   * @desc Search all recipe, portfolio and chef
   * @access Public
   * **/
  .get(recipeController.searchAllRCP);

routes
  .route(PATH.RATING)
  /**
   * @api {POST} /api/user/recipe/rating
   * @desc Add rating and review to recipe
   * @access Private
   * **/
  .post(
    validateRating(VALIDATOR_RATING.ADD_RATING_RECIPE),
    appAuthMiddleware,
    recipeController.addRatingToRecipe
  )
  /**
   * @api {GET} /api/user/recipe/rating
   * @desc Get rating and review of recipe
   * @access Private
   * **/
  .get(
    validateRating(VALIDATOR_RATING.RECIPE_ID),
    recipeController.getRecipeRatings
  );

export default routes;
