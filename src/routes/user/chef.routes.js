/**
 * * User Chef Routes
 */

import { Router } from 'express';
import * as chefController from '../../controllers/user/chef.controller';
import { appAuthMiddleware } from '../../middleware/authentication';

import { validate } from '../../validator/user/chef.validator';
import { constants as VALIDATOR } from '../../constant/validator/chef';

import { validateRating } from '../../validator/user/rating.validator';
import { constants as VALIDATOR_RATING } from '../../constant/validator/rating';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  DETAIL: '/details',
  RATING: '/rating',
  TOP: '/top',
};

routes
  .route(PATH.ROOT)
  /**
   * @api {GET} /api/user/chef
   * @desc Get Chefs recipe
   * @access Public
   * **/
  .get(chefController.getAllChef);

routes
  .route(PATH.DETAIL)
  /**
   * @api {GET} /api/user/chef/details
   * @desc Get Chefs recipe
   * @access Public
   * **/
  .get(validate(VALIDATOR.CHEF_ID), chefController.getChefDetails);

routes
  .route(PATH.TOP)
  /**
   * @api {GET} /api/user/chef/TOP
   * @desc Get Top Chefs
   * @access Public
   * **/
  .get(chefController.topChefList);

routes
  .route(PATH.RATING)
  /**
   * @api {POST} /api/user/chef/rating
   * @desc Add rating and review
   * @access Private
   * **/
  .post(
    validateRating(VALIDATOR_RATING.ADD_RATING_CHEF),
    appAuthMiddleware,
    chefController.addRatingToChef
  )
  /**
   * @api {GET} /api/user/chef/rating
   * @desc Get chefs Ratings
   * @access Public
   * **/
  .get(validateRating(VALIDATOR_RATING.CHEF_ID), chefController.getChefsRating);

export default routes;
