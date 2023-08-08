/**
 * * Admin Feedback Routes
 */

import { Router } from 'express';
import * as feedbackController from '../../controllers/admin/feedback.controller';
import { validate } from '../../validator/chef/feedback.validator';
import { constants as VALIDATOR } from '../../constant/validator/feedback';
import { adminAuthMiddleware } from '../../middleware/authentication';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  CHEF_FEEDBACK: '/chef_feedbacks',
  USERS_FEEDBACK: '/user_feedbacks',
};

routes.use(adminAuthMiddleware);

routes
  .route(PATH.CHEF_FEEDBACK)
  /**
   * @api {GET} /api/admin/feedback/chef_feedbacks
   * @desc Get All Chef Feedbacks
   * @access Private
   * **/
  .get(feedbackController.listOfChefFeedbacks);

routes
  .route(PATH.USERS_FEEDBACK)
  /**
   * @api {GET} /api/admin/feedback/user_feedbacks
   * @desc Get All Users Feedbacks
   * @access Private
   * **/
  .get(feedbackController.listOfUserFeedbacks);

routes
  .route(PATH.ROOT)
  /**
   * @api {PUT} /api/admin/feedback
   * @desc Update Feedback Status
   * @access Private
   * **/
  .put(
    validate(VALIDATOR.FEEDBACK_STATUS),
    feedbackController.updateFeedbackStatus
  );

export default routes;
