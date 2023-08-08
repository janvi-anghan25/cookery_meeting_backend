/**
 * * Admin Routes
 */

import { Router } from 'express';
const routes = new Router();
import * as dashboardCtrl from '../../controllers/admin/dashboard.controller';
import { adminAuthMiddleware } from '../../middleware/authentication';

const PATH = {
  ROOT: '/',
  CARD_DATA: '/user_data',
};

/**
 * @desc Admin Auth Middleware: Use for authenticate adminuser routes
 * **/
routes.use(adminAuthMiddleware);

/**
 * @api {get} /api/admin/dashboard/user_data
 * @desc  Get User Card Data
 * @access Private
 * **/
routes.get(PATH.CARD_DATA, dashboardCtrl.getCardData);

export default routes;
