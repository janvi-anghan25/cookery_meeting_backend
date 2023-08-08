/**
 * * Admin Purchase Routes
 */

import { Router } from 'express';
import * as purchaseController from '../../controllers/admin/purchase.controller';

import { adminAuthMiddleware } from '../../middleware/authentication';
import { validate } from '../../validator/admin/package.validator';
import { constants as VALIDATOR } from '../../constant/validator/package';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  LIST: '/list',
  PROMO: '/promo',
};

routes.use(adminAuthMiddleware);

routes
  .route(PATH.ROOT)
  /**
   * @api {GET} /api/admin/package_purchase
   * @desc package purchase details
   * @access Private
   * **/
  .get(
    validate(VALIDATOR.PURCHASED_ID),
    purchaseController.packagePurchasedDetails
  );

routes
  .route(PATH.LIST)
  /**
   * @api {GET} /api/admin/package_purchase/list
   * @desc package purchase list
   * @access Private
   * **/
  .get(purchaseController.packagePurchasedList);

routes
  .route(PATH.PROMO)
  /**
   * @api {GET} /api/admin/package_purchase/promo
   * @desc promo applied list
   * @access Private
   * **/
  .get(purchaseController.promoPurchasedList);

export default routes;
