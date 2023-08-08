/**
 * * Admin Promo Code Routes
 */

import { Router } from 'express';
import * as promoCodeController from '../../controllers/admin/promoCode.controller';

import { adminAuthMiddleware } from '../../middleware/authentication';
import { configMiddleware } from '../../middleware/configdata';
import { validate } from '../../validator/admin/promocode.validator';
import { constants as VALIDATOR } from '../../constant/validator/promoCode';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
};

routes.use(adminAuthMiddleware);

routes
  .route(PATH.ROOT)
  /**
   * @api {POST} /api/admin/promocode
   * @desc Create Promo Code
   * @access Private
   * **/
  .post(
    validate(VALIDATOR.ADD_NEW_PROMO),
    configMiddleware,
    promoCodeController.createPromoCode
  )
  /**
   * @api {GET} /api/admin/promocode
   * @desc Get Promo Code
   * @access Private
   * **/
  .get(promoCodeController.getPromoCode)
  /**
   * @api {DELETE} /api/admin/promocode
   * @desc Delete Promo Code
   * @access Private
   * **/
  .delete(
    validate(VALIDATOR.DELETE_PROMO),
    promoCodeController.deletePromoCode
  );

export default routes;
