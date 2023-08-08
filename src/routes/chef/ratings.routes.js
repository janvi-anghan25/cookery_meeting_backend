/**
 * * Chef Ratings Routes
 */

import { Router } from 'express';
import * as ratingsController from '../../controllers/chef/ratings.controller';

import { chefAuthMiddleware } from '../../middleware/authentication';
const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
};

routes.use(chefAuthMiddleware);

routes
  .route(PATH.ROOT)

  /**
   * @api {POST} /api/chef/ratings
   * @desc Get Rating List
   * @access Private
   * **/
  .get(ratingsController.getRatings);

export default routes;
