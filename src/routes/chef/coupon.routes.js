/**
 * * Chef Coupon Routes
 */

import { Router } from 'express';
import * as couponController from '../../controllers/chef/coupon.controller';

import { chefAuthMiddleware } from '../../middleware/authentication';
import { validate } from '../../validator/chef/coupon.validator';
import { constants as VALIDATOR } from '../../constant/validator/coupon';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  LIST: '/list',
};

routes.use(chefAuthMiddleware);

routes
  .route(PATH.ROOT)
  /**
   * @api {POST} /api/chef/coupon
   * @desc Create Coupon
   * @access Private
   * **/
  .post(validate(VALIDATOR.ADD_COUPON), couponController.createCoupon)
  /**
   * @api {GET} /api/chef/coupon
   * @desc Create Coupon
   * @access Private
   * **/
  .get(validate(VALIDATOR.GET_COUPON), couponController.getCouponDetails)
  /**
   * @api {DELETE} /api/chef/coupon
   * @desc Delete Coupon
   * @access Private
   * **/
  .delete(validate(VALIDATOR.DELETE_COUPON), couponController.deleteCoupon)
  /**
   * @api {PUT} /api/chef/coupon
   * @desc Update Coupon Status
   * @access Private
   * **/
  .put(
    validate(VALIDATOR.EDIT_COUPON_STATUS),
    couponController.updateCouponStatus
  );

routes
  .route(PATH.LIST)
  /**
   * @api {GET} /api/chef/coupon/list
   * @desc Coupon List
   * @access Private
   * **/
  .get(couponController.couponList);

export default routes;
