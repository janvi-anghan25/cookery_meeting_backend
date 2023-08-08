/**
 * * User Feedback Routes
 */

import { Router } from 'express';
import * as feedbackController from '../../controllers/user/feedback.controller';
import { appAuthMiddleware } from '../../middleware/authentication';

import { validate } from '../../validator/chef/feedback.validator';
import { constants as VALIDATOR } from '../../constant/validator/feedback';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  FEEDBACK: '/add',
};

routes.use(appAuthMiddleware);

routes
  .route(PATH.FEEDBACK)
  /**
   * @api {POST} /api/user/feedback/add
   * @desc Add Feedback
   * @access Private
   * **/
  .post(validate(VALIDATOR.ADD_FEEDBACK), feedbackController.addFeedback);

export default routes;
