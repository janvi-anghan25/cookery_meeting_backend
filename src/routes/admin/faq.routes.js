/**
 * * FAQ Routes
 */

import { Router } from 'express';
const routes = new Router();
import * as faqCtrl from '../../controllers/admin/faq.controller';
import { adminAuthMiddleware } from '../../middleware/authentication';
import { validate } from '../../validator/admin/admin.validator';
import { constants as VALIDATOR } from '../../constant/validator/admin';

const PATH = {
  ROOT: '/',
  ADD: '/add',
};

/**
 * @desc Admin Auth Middleware: Use for authenticate adminuser routes
 * **/
routes.use(adminAuthMiddleware);

/**
 * @api {POST} /api/admin/faq/add
 * @desc  Add FAQ
 * @access Private
 * **/
routes.post(PATH.ADD, validate(VALIDATOR.ADD_FAQ), faqCtrl.addFAQ);

routes
  .route(PATH.ROOT)

  /**
   * @api {GET} /api/admin/faq
   * @desc  Get All FAQ
   * @access Private
   * **/
  .get(faqCtrl.getAllFAQ)

  /**
   * @api {PUT} /api/admin/faq
   * @desc  Edit FAQ
   * @access Private
   * **/
  .put(validate(VALIDATOR.EDIT_FAQ), faqCtrl.editFAQ)
  /**
   * @api {DELETE} /api/admin/faq
   * @desc  Delete FAQ
   * @access Private
   * **/
  .delete(validate(VALIDATOR.DELETE_FAQ), faqCtrl.deleteFAQ);

export default routes;
