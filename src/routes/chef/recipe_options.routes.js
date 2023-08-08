/**
 * * Chef Recipe Options Routes
 */

import { Router } from 'express';
import * as recipeOptController from '../../controllers/chef/recipe_options.controller';

import { chefAuthMiddleware } from '../../middleware/authentication';
import { validate } from '../../validator/admin/recipe_options.validator';
import { constants as VALIDATOR } from '../../constant/validator/reciepe_options';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  LIST: '/list',
};

routes.use(chefAuthMiddleware);

routes
  .route(PATH.ROOT)
  /**
   * @api {GET} /api/chef/recipe
   * @desc Get Recipe Option
   * @access Private
   * **/
  .get(
    validate(VALIDATOR.RECIPE_OPTION_ID),
    recipeOptController.getRecipeOptions
  );

routes
  .route(PATH.LIST)
  /**
   * @api {GET} /api/chef/recipe/list
   * @desc List All Recipe Options
   * @access Private
   * **/
  .get(recipeOptController.getAllRecipeOptions);

export default routes;
