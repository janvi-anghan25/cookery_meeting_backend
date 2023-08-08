/**
 * * FAQ Routes
 */

import { Router } from 'express';
import * as faqCtrl from '../../controllers/user/faq.controller';

// import { appAuthMiddleware } from '../../middleware/authentication';
const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
};

// routes.use(appAuthMiddleware);

routes
  .route(PATH.ROOT)
  /**
   * @api {GET} /api/user/faq
   * @desc Get All FAQ
   * @access Private
   * **/
  .get(faqCtrl.getAllFAQ);

export default routes;
