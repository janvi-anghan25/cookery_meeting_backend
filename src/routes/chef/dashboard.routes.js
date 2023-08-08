/**
 * * Admin Routes
 */

import { Router } from 'express';
const routes = new Router();
import * as dashboardController from '../../controllers/chef/dashboard.controller';
import { chefAuthMiddleware } from '../../middleware/authentication';

const PATH = {
  ROOT: '/',
  CARD_DATA: '/user_data',
  ORDER_CHART: '/order_chart',
};

routes.use(chefAuthMiddleware);

/**
 * @api {get} /api/chef/dashboard/user_data
 * @desc  Get User Card Data
 * @access Private
 * **/
routes.get(PATH.CARD_DATA, dashboardController.getCardData);

/**
 * @api {get} /api/chef/dashboard/order_chart
 * @desc  Get User Order Chart Data
 * @access Private
 * **/
routes.get(PATH.ORDER_CHART, dashboardController.getOrdersChart);

export default routes;
