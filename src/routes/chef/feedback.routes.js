/**
 * * Chef Feedback Routes
 */

import { Router } from 'express';
import * as feedbackController from '../../controllers/chef/feedback.controller';

import { chefAuthMiddleware } from '../../middleware/authentication';
import { validate } from '../../validator/chef/feedback.validator';
import { constants as VALIDATOR } from '../../constant/validator/feedback';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  FEEDBACK: '/add',
};

routes.use(chefAuthMiddleware);

routes
  .route(PATH.FEEDBACK)
  /**
   * @api {POST} /api/chef/feedback/add
   * @desc Add Feedback
   * @access Private
   * **/
  .post(validate(VALIDATOR.ADD_FEEDBACK), feedbackController.addFeedback);

routes
  .route(PATH.ROOT)
  /**
   * @api {PUT} /api/chef/feedback
   * @desc Update Feedback Status
   * @access Private
   * **/
  .put(
    validate(VALIDATOR.FEEDBACK_STATUS),
    feedbackController.updateFeedbackStatus
  )

  /**
   * @api {PUT} /api/chef/feedback
   * @desc Get All Users Feedback
   * @access Private
   * **/
  .get(feedbackController.getAllCustomerFeedback);

export default routes;
