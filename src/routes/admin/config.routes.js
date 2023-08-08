/**
 * * Admin Config Routes
 */

import { Router } from 'express';
import * as configController from '../../controllers/admin/config.controller';

import { adminAuthMiddleware } from '../../middleware/authentication';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
};

routes.use(adminAuthMiddleware);

routes
  .route(PATH.ROOT)
  /**
   * @api {PUT} /api/admin/config
   * @desc Add and Update Config Data (application fee)
   * @access Private
   * **/
  .put(configController.addConfigData)

  /**
   * @api {GET} /api/admin/config
   * @desc Get Config Data (application fee)
   * @access Private
   * **/
  .get(configController.getConfigData);

export default routes;
