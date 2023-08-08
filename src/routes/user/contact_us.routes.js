/**
 * * User Contact Us Routes
 */

import { Router } from 'express';
import * as contactUsController from '../../controllers/user/contact_us.controller';
import { appAuthMiddleware } from '../../middleware/authentication';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
};

routes.use(appAuthMiddleware);

routes
  .route(PATH.ROOT)
  /**
   * @api {POST} /api/user/contact_us/add
   * @desc Add Contact Us
   * @access Private
   * **/
  .post(contactUsController.contactUsForm);

export default routes;
