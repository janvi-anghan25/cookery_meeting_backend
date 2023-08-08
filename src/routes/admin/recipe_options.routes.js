/**
 * * Admin Recipe Options Routes
 */

import { Router } from 'express';
import * as recipeOptController from '../../controllers/admin/recipe_options.controller';

import { adminAuthMiddleware } from '../../middleware/authentication';
import { validate } from '../../validator/admin/recipe_options.validator';
import { constants as VALIDATOR } from '../../constant/validator/reciepe_options';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  LIST: '/list',
};

routes.use(adminAuthMiddleware);

routes
  .route(PATH.ROOT)
  /**
   * @api {POST} /api/admin/recipe_options
   * @desc Add Recipe Option
   * @access Private
   * **/
  .post(
    validate(VALIDATOR.ADD_RECIPE_OPTION),
    recipeOptController.createRecipeOptions
  )
  /**
   * @api {GET} /api/admin/recipe_options
   * @desc Get Recipe Option
   * @access Private
   * **/
  .get(
    validate(VALIDATOR.RECIPE_OPTION_ID),
    recipeOptController.getRecipeOptions
  )
  /**
   * @api {DELETE} /api/admin/recipe_options
   * @desc Delete Recipe Option
   * @access Private
   * **/
  .delete(
    validate(VALIDATOR.RECIPE_OPTION_ID),
    recipeOptController.deleteRecipeOptions
  )
  /**
   * @api {PUT} /api/admin/recipe_options
   * @desc Edit Recipe Option
   * @access Private
   * **/
  .put(
    validate(VALIDATOR.EDIT_RECIPE_OPTION),
    recipeOptController.editRecipeOptions
  );

routes
  .route(PATH.LIST)
  /**
   * @api {GET} /api/admin/recipe_options/list
   * @desc List All Recipe Options
   * @access Private
   * **/
  .get(recipeOptController.getAllRecipeOptions);

export default routes;
