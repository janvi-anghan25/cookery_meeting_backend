/**
 * * Admin Package Routes
 */

import { Router } from 'express';
import * as packageController from '../../controllers/admin/package.controller';

import { adminAuthMiddleware } from '../../middleware/authentication';
import { configMiddleware } from '../../middleware/configdata';
import { validate } from '../../validator/admin/package.validator';
import { constants as VALIDATOR } from '../../constant/validator/package';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  LIST: '/list',
  DEFAULT: '/default',
};

routes.use(adminAuthMiddleware);

routes
  .route(PATH.ROOT)
  /**
   * @api {POST} /api/admin/package
   * @desc Create Package
   * @access Private
   * **/
  .post(
    validate(VALIDATOR.CREATE_PACKAGE),
    configMiddleware,
    packageController.createPackage
  )
  /**
   * @api {GET} /api/admin/package
   * @desc Get Package Details
   * @access Private
   * **/
  .get(validate(VALIDATOR.PACKAGE_ID), packageController.getPackageDetails)
  /**
   * @api {PUT} /api/admin/package
   * @desc Update Package
   * @access Private
   * **/
  .put(validate(VALIDATOR.UPDATE_PACKAGE), packageController.updatePackage)
  /**
   * @api {DELETE} /api/admin/package
   * @desc Delete Package
   * @access Private
   * **/
  .delete(validate(VALIDATOR.PACKAGE_ID), packageController.deletePackage);

routes
  .route(PATH.LIST)
  /**
   * @api {POST} /api/admin/package/list
   * @desc Create Package
   * @access Private
   * **/
  .get(packageController.myPackageList);

routes
  .route(PATH.DEFAULT)
  /**
   * @api {POST} /api/admin/package/default
   * @desc Create Package
   * @access Private
   * **/
  .put(validate(VALIDATOR.PACKAGE_ID), packageController.setDefaultPackage);

export default routes;
