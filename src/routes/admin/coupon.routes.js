/**
 * * Admin Coupon Routes
 */

import { Router } from 'express';
import * as couponController from '../../controllers/admin/coupon.controller';
import { validate } from '../../validator/admin/admin.validator';
import { constants as VALIDATOR } from '../../constant/validator/admin';

import { adminAuthMiddleware } from '../../middleware/authentication';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  DETAILS: '/details',
};

routes.use(adminAuthMiddleware);

routes
  .route(PATH.ROOT)
  /**
   * @api {GET} /api/admin/coupon
   * @desc Get Coupon List
   * @access Private
   * **/
  .get(couponController.getCouponList)
  /**
   * @api {DELETE} /api/admin/coupon
   * @desc Delete Coupon
   * @access Private
   * **/
  .delete(validate(VALIDATOR.DELETE_COUPON), couponController.deleteCoupon);

routes
  .route(PATH.DETAILS)
  /**
   * @api {GET} /api/admin/coupon/details
   * @desc Get Coupon List
   * @access Private
   * **/
  .get(couponController.getCouponDetails);

export default routes;
