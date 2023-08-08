/**
 * * Chef Stripe Routes
 */

import { Router } from 'express';
import * as stripeController from '../../../controllers/chef/stripe/marketplace.controller';

import { chefAuthMiddleware } from '../../../middleware/authentication';
// import { validate } from '../../validator/chef/package.validator';
// import { constants as VALIDATOR } from '../../constant/validator/package';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  CONNECT: '/connect',
  DASHBOARD: '/dashboard',
  REFRESH_TOKEN: '/refresh_token',
  ACCOUNT: '/stripe_account',
};

/**
 * @api {POST} /api/chef/stripe/refresh_token
 * @desc Fetch the account balance to determine the available funds
 * @access Private
 * **/
routes
  .route(PATH.REFRESH_TOKEN)
  .get(stripeController.generateRefreshAccountLink);

routes.use(chefAuthMiddleware);

routes
  .route(PATH.CONNECT)
  /**
   * @api {GET} /api/chef/stripe/connect
   * @desc Connect to stripe
   * @access Private
   * **/
  .get(stripeController.connectStripeAccount);

/**
 * @api {GET} /api/chef/stripe/dashboard
 * @desc Get Store Owner Stripe Dashboard
 * @access Private
 * **/

routes.route(PATH.DASHBOARD).get(stripeController.stripeUserDashboard);

/**
 * @api {GET} /api/chef/stripe/stripe_account
 * @desc Stripe Info
 * @access Private
 * **/

routes.route(PATH.ACCOUNT).get(stripeController.getStripeAccount);

export default routes;
