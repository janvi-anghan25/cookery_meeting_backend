/**
 * * User Cart Routes
 */

import { Router } from 'express';
import * as cartController from '../../controllers/user/cart.controller';

import { appAuthMiddleware } from '../../middleware/authentication';
import { validate } from '../../validator/user/cart.validator';
import { constants as VALIDATOR } from '../../constant/validator/cart';
import { apiLimiter } from '../../utils/rateLimit';
const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  REMOVE: '/remove',
  STATUS: '/status',
  APPLY_COUPON: '/apply_coupon',
};

routes.use(appAuthMiddleware);

routes
  .route(PATH.ROOT)
  /**
   * @api {POST} /api/user/cart
   * @desc Add to cart
   * @access Private
   * **/
  .post(validate(VALIDATOR.ADD_TO_CART), apiLimiter, cartController.addToCart)
  /**
   * @api {GET} /api/user/cart
   * @desc Get My Cart
   * @access Private
   * **/
  .get(cartController.myCart)
  /**
   * @api {DELETE} /api/user/cart
   * @desc Clear Whole Cart
   * @access Private
   * **/
  .delete(cartController.removeCart)
  /**
   * @api {PUT} /api/user/cart
   * @desc Edit Cart
   * @access Private
   * **/
  .put(validate(VALIDATOR.EDIT_CART), cartController.editCart);

routes
  .route(PATH.REMOVE)
  /**
   * @api {DELETE} /api/user/cart/remove?portfolio_id=
   * @desc Remove Single Portfolio From Cart
   * @access Private
   * **/
  .delete(
    validate(VALIDATOR.REMOVE_CART),
    cartController.removeSinglePortfolio
  );

routes
  .route(PATH.STATUS)
  /**
   * @api {GET} /api/user/cart/status
   * @desc Check User cart status
   * @access Private
   * **/
  .get(cartController.checkCartStatus);

routes
  .route(PATH.APPLY_COUPON)
  /**
   * @api {PUT} /api/user/cart/apply_coupon
   * @desc Apply Coupon
   * @access Private
   * **/
  .put(validate(VALIDATOR.COUPON), cartController.applyCoupon);

export default routes;
