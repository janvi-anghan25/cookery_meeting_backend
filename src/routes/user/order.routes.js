/**
 * * User Order Routes
 */

import { Router } from 'express';
import * as orderController from '../../controllers/user/order.controller';

import { appAuthMiddleware } from '../../middleware/authentication';

import { validate } from '../../validator/user/order.validator';
import { constants as VALIDATOR } from '../../constant/validator/order';
const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  CHECKOUT_SESSION: '/checkout-session',
  CANCEL: '/cancel',
  REFUND: '/refund',
  DETAILS: '/details',
  MEETING: '/meeting',
};

routes.use(appAuthMiddleware);

routes
  .route(PATH.CHECKOUT_SESSION)
  /**
   * @api {POST} /api/user/order/checkout-session
   * @desc Proceed To check out
   * @access Private
   * **/
  .post(orderController.getCheckoutSession);

routes
  .route(PATH.ROOT)
  /**
   * @api {GET} /api/user/order/checkout-session
   * @desc Get Users Order List
   * @access Private
   * **/
  .get(orderController.getOrderList);

routes
  .route(PATH.DETAILS)
  /**
   * @api {GET} /api/user/order/details
   * @desc Get Users Order details
   * @access Private
   * **/
  .get(orderController.orderDetails);

routes
  .route(PATH.CANCEL)
  /**
   * @api {POST} /api/user/order/cancel
   * @desc Cancel Order
   * @access Private
   * **/
  .post(validate(VALIDATOR.CANCEL_ORDER), orderController.cancelOrder);

routes
  .route(PATH.REFUND)
  /**
   * @api {POST} /api/user/order/refund
   * @desc Refund List
   * @access Private
   * **/
  .get(orderController.orderRefundList);

routes
  .route(PATH.REFUND + PATH.DETAILS)
  /**
   * @api {POST} /api/user/order/refund/details
   * @desc Refund List
   * @access Private
   * **/
  .get(validate(VALIDATOR.REFUND_ID), orderController.orderRefundDetails);

routes
  .route(PATH.MEETING)
  /**
   * @api {GET} /api/user/order/meeting
   * @desc Get Upcoming Meeting List
   * @access Private
   * **/
  .get(orderController.upcomingMeeting);

export default routes;
