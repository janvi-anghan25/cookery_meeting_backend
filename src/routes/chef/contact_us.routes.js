/**
 * * Chef Contact Us Routes
 */

import { Router } from 'express';
import * as contactUsController from '../../controllers/chef/contact_us.controller';

import { chefAuthMiddleware } from '../../middleware/authentication';
import { validate } from '../../validator/chef/feedback.validator';
import { constants as VALIDATOR } from '../../constant/validator/feedback';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
};

routes.use(chefAuthMiddleware);

routes
  .route(PATH.ROOT)
  /**
   * @api {POST} /api/chef/contact_us
   * @desc Add Contact Us
   * @access Private
   * **/
  .post(validate(VALIDATOR.CONTACT_US), contactUsController.contactUsForm)

  /**
   * @api {POST} /api/chef/contact_us
   * @desc Get All Customer Contact Us
   * @access Private
   * **/
  .get(contactUsController.customerContactUs);

export default routes;
