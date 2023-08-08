/**
 * * Chef Portfolio Routes
 */

import { Router } from 'express';
import * as portfolioController from '../../controllers/chef/portfolio.controller';

import { chefAuthMiddleware } from '../../middleware/authentication';
import { validate } from '../../validator/chef/portfolio.validator';
import { constants as VALIDATOR } from '../../constant/validator/portfolio';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  RECIPE: '/active_recipe',
  LIST: '/list',
  STATUS: '/status',
  DUPLICATE: '/duplicate',
};

routes.use(chefAuthMiddleware);

routes
  .route(PATH.ROOT)
  /**
   * @api {POST} /api/chef/portfolio
   * @desc Add Portfolio
   * @access Private
   * **/
  .post(validate(VALIDATOR.ADD_PORTFOLIO), portfolioController.createPortfolio)
  /**
   * @api {PUT} /api/chef/portfolio
   * @desc Update Portfolio
   * @access Private
   * **/
  .put(validate(VALIDATOR.PORTFOLIO_ID), portfolioController.updatePortfolio)
  /**
   * @api {DELETE} /api/chef/portfolio
   * @desc Delete Portfolio
   * @access Private
   * **/
  .delete(validate(VALIDATOR.PORTFOLIO_ID), portfolioController.deletePortfolio)
  /**
   * @api {GET} /api/chef/portfolio
   * @desc Get Portfolio
   * @access Private
   * **/
  .get(validate(VALIDATOR.PORTFOLIO_ID), portfolioController.getPortfolio);

routes
  .route(PATH.STATUS)
  /**
   * @api {PUT} /api/chef/portfolio/status
   * @desc Update Portfolio
   * @access Private
   * **/
  .put(
    validate(VALIDATOR.PORTFOLIO_ID),
    portfolioController.updatePortfolioStatus
  );

routes
  .route(PATH.LIST)
  /**
   * @api {POST} /api/chef/portfolio/list
   * @desc List of Portfolio
   * @access Private
   * **/
  .get(portfolioController.listPortfolio);

routes
  .route(PATH.DUPLICATE)
  /**
   * @api {POST} /api/chef/portfolio/duplicate
   * @desc Duplicate Portfolio
   * @access Private
   * **/
  .post(
    validate(VALIDATOR.PORTFOLIO_ID),
    portfolioController.duplicatePortfolio
  );

routes
  .route(PATH.RECIPE)
  /**
   * @api {POST} /api/chef/portfolio/active_recipe
   * @desc List of Portfolio
   * @access Private
   * **/
  .get(portfolioController.activeRecipe);

export default routes;
