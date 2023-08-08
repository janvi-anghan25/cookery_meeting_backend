/**
 * * Chef Recipe Routes
 */

import { Router } from 'express';
import * as recipeController from '../../controllers/chef/recipe.controller';

import { chefAuthMiddleware } from '../../middleware/authentication';
import { validate } from '../../validator/chef/recipe.validator';
import { constants as VALIDATOR } from '../../constant/validator/recipe';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  LIST: '/list',
  STATUS: '/status',
};

routes.use(chefAuthMiddleware);

routes
  .route(PATH.ROOT)
  /**
   * @api {POST} /api/chef/recipe
   * @desc Add Recipe
   * @access Private
   * **/
  .post(validate(VALIDATOR.ADD_RECIPE), recipeController.addRecipe)
  /**
   * @api {PUT} /api/chef/recipe
   * @desc Update Recipe
   * @access Private
   * **/
  .put(validate(VALIDATOR.RECIPE_ID), recipeController.updateRecipe)
  /**
   * @api {DELETE} /api/chef/recipe
   * @desc Delete Recipe
   * @access Private
   * **/
  .delete(validate(VALIDATOR.RECIPE_ID), recipeController.deleteRecipe)
  /**
   * @api {GET} /api/chef/recipe
   * @desc Get Recipe
   * @access Private
   * **/
  .get(validate(VALIDATOR.RECIPE_ID), recipeController.getRecipe);

routes
  .route(PATH.LIST)
  /**
   * @api {GET} /api/chef/recipe/list
   * @desc Get Recipe List
   * @access Private
   * **/
  .get(recipeController.getAllRecipes);

routes
  .route(PATH.STATUS)
  /**
   * @api {PUT} /api/chef/recipe/status
   * @desc Update Recipe Status
   * @access Private
   * **/
  .put(validate(VALIDATOR.UPDATE_STATUS), recipeController.updateRecipeStatus);

export default routes;
