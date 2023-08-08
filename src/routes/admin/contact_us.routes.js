/**
 * * Admin Contact Us Routes
 */

import { Router } from 'express';
import * as contactUsController from '../../controllers/admin/contact_us.controller';

import { adminAuthMiddleware } from '../../middleware/authentication';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  CHEF_CONTACT_US: '/chef_contact_us',
  USERS_CONTACT_US: '/user_contact_us',
  CUSTOMER_CONTACT_US: '/customer_contact_us',
};

routes.use(adminAuthMiddleware);

routes
  .route(PATH.CHEF_CONTACT_US)
  /**
   * @api {GET} /api/admin/contact/chef_contact_us
   * @desc Get All Chef Contact Us
   * @access Private
   * **/
  .get(contactUsController.listOfChefContactUs);

routes
  .route(PATH.USERS_CONTACT_US)
  /**
   * @api {GET} /api/admin/contact/user_contact_us
   * @desc Get All Customer Contact Us
   * @access Private
   * **/
  .get(contactUsController.listOfCustomerContactUs);

routes
  .route(PATH.CUSTOMER_CONTACT_US)
  /**
   * @api {GET} /api/admin/contact/customer_contact_us
   * @desc Get All Anonymous User Contact Us
   * @access Private
   * **/
  .get(contactUsController.listOfUserContactUs);

export default routes;
