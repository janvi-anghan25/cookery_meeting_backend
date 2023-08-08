/**
 * * Chef Order Routes
 */

import { Router } from 'express';
import * as orderController from '../../controllers/chef/order.controller';

import { chefAuthMiddleware } from '../../middleware/authentication';
import { validate } from '../../validator/chef/order.validator';
import { constants as VALIDATOR } from '../../constant/validator/order';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  LIST: '/list',
  DETAILS: '/details',
  REFUND: '/refund',
};

routes.use(chefAuthMiddleware);

routes
  .route(PATH.ROOT)
  /**
   * @api {GET} /api/chef/order
   * @desc Order List
   * @access Private
   * **/
  .get(orderController.orderList)
  /**
   * @api {PUT} /api/chef/order
   * @desc Edit Order Status
   * @access Private
   * **/
  .put(orderController.editOrderStatus);

routes
  .route(PATH.DETAILS)
  /**
   * @api {GET} /api/chef/order/details
   * @desc Order Details
   * @access Private
   * **/
  .get(validate(VALIDATOR.ORDER_NUMBER), orderController.orderDetails);

routes
  .route(PATH.REFUND)
  /**
   * @api {GET} /api/chef/order/refund
   * @desc Refund List
   * @access Private
   * **/
  .get(orderController.orderRefundList);

routes
  .route(PATH.REFUND + PATH.DETAILS)
  /**
   * @api {GET} /api/chef/order/refund/details
   * @desc Refund List
   * @access Private
   * **/
  .get(orderController.orderRefundDetails);

export default routes;
