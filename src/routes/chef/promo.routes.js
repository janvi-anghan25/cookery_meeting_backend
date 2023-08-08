/**
 * * Chef Package Routes
 */

import { Router } from 'express';
import * as promoController from '../../controllers/chef/promo.controller';

import { chefAuthMiddleware } from '../../middleware/authentication';
import { validate } from '../../validator/chef/package.validator';
import { constants as VALIDATOR } from '../../constant/validator/package';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  APPLY_PROMO: '/apply',
};

routes.use(chefAuthMiddleware);

routes
  .route(PATH.APPLY_PROMO)
  /**
   * @api {GET} /api/user/promo/apply
   * @desc Apply Promo code
   * @access Private
   * **/
  .post(validate(VALIDATOR.APPLY_PROMO), promoController.applyPromo);

export default routes;
