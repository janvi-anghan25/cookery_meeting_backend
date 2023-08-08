/**
 * * Chef Package Routes
 */

import { Router } from 'express';
import * as packageController from '../../controllers/chef/package.controller';

import { chefAuthMiddleware } from '../../middleware/authentication';
import { validate } from '../../validator/chef/package.validator';
import { constants as VALIDATOR } from '../../constant/validator/package';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  LIST: '/list',
  BUY: '/buy',
  ACTIVE: '/active',
};

routes.use(chefAuthMiddleware);

routes
  .route(PATH.LIST)
  /**
   * @api {GET} /api/user/package/list
   * @desc Create Package
   * @access Private
   * **/
  .get(packageController.getAllPackage);

routes
  .route(PATH.ROOT)
  /**
   * @api {GET} /api/user/package
   * @desc Create Package
   * @access Private
   * **/
  .get(validate(VALIDATOR.PACKAGE_ID), packageController.getPackageDetails);

routes
  .route(PATH.BUY)
  /**
   * @api {POST} /api/user/package/buy
   * @desc Create Package
   * @access Private
   * **/
  .post(validate(VALIDATOR.PACKAGE_ID), packageController.buyPackage);

routes
  .route(PATH.ACTIVE)
  /**
   * @api {GET} /api/user/package/active
   * @desc Create Package
   * @access Private
   * **/
  .get(packageController.activePackage);

export default routes;
