/**
 * * User Portfolio Routes
 */

import { Router } from 'express';
import * as portfolioController from '../../controllers/user/portfolio.controller';
import { appAuthMiddleware } from '../../middleware/authentication';

import { validate } from '../../validator/user/portfolio.validator';
import { constants as VALIDATOR } from '../../constant/validator/portfolio';

import { validateRating } from '../../validator/user/rating.validator';
import { constants as VALIDATOR_RATING } from '../../constant/validator/rating';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  CHEF: '/chef',
  LIST: '/list',
  GET_DATE: '/get_date',
  RATING: '/rating',
  TOP: '/top',
};

routes
  .route(PATH.CHEF)
  /**
   * @api {GET} /api/user/portfolio/chef?chef_id=?search=
   * @desc Get Chefs Portfolio
   * @access Public
   * **/
  .get(validate(VALIDATOR.CHEF_ID), portfolioController.getChefPortfolio);

routes
  .route(PATH.LIST)
  /**
   * @api {POST} /api/user/portfolio/list
   * @desc List of Portfolio
   * @access Public
   * **/
  .get(portfolioController.listPortfolio);

routes
  .route(PATH.ROOT)
  /**
   * @api {GET} /api/user/portfolio?portfolio_id=
   * @desc Get Portfolio Details
   * @access Public
   * **/
  .get(
    validate(VALIDATOR.PORTFOLIO_ID),
    portfolioController.getPortfolioDetails
  );

routes
  .route(PATH.GET_DATE)
  /**
   * @api {GET} /api/user/portfolio?portfolio_id=
   * @desc Get Portfolio Details
   * @access Public
   * **/
  .get(portfolioController.getChefUnavailableDates);

routes
  .route(PATH.TOP)
  /**
   * @api {GET} /api/user/portfolio/TOP
   * @desc Get Top Portfolio
   * @access Public
   * **/
  .get(portfolioController.topPortfolioList);

routes
  .route(PATH.RATING)
  /**
   * @api {POST} /api/user/chef/rating
   * @desc Add rating and review
   * @access Private
   * **/
  .post(
    validateRating(VALIDATOR_RATING.ADD_RATING_PORTFOLIO),
    appAuthMiddleware,
    portfolioController.addRatingToPortfolio
  )
  /**
   * @api {GET} /api/user/chef/rating
   * @desc Add rating and review
   * @access Private
   * **/
  .get(
    validateRating(VALIDATOR_RATING.PORTFOLIO_ID),
    portfolioController.getPortfolioRating
  );

export default routes;
