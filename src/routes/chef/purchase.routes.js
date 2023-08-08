/**
 * * Chef Purchase Routes
 */

import { Router } from 'express';
import * as purchaseController from '../../controllers/chef/purchase.controller';

import { chefAuthMiddleware } from '../../middleware/authentication';
import { validate } from '../../validator/chef/package.validator';
import { constants as VALIDATOR } from '../../constant/validator/package';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  LIST: '/list',
};

routes.use(chefAuthMiddleware);

routes
  .route(PATH.ROOT)
  /**
   * @api {GET} /api/chef/package_purchase
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
   * @api {GET} /api/chef/package_purchase/list
   * @desc package purchase list
   * @access Private
   * **/
  .get(purchaseController.packagePurchasedList);

export default routes;
