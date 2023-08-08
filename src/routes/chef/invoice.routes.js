/**
 * * Chef Invoice Routes
 */

import { Router } from 'express';
import * as invoiceController from '../../controllers/chef/invoice.controller';

import { chefAuthMiddleware } from '../../middleware/authentication';
import { validate } from '../../validator/chef/package.validator';
import { constants as VALIDATOR } from '../../constant/validator/package';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  LIST: '/list',
};

routes.use(chefAuthMiddleware);

routes
  .route(PATH.ROOT)
  /**
   * @api {GET} /api/chef/invoice
   * @desc Invoice details
   * @access Private
   * **/
  .get(validate(VALIDATOR.INVOICE_ID), invoiceController.invoiceDetails);

routes
  .route(PATH.LIST)
  /**
   * @api {GET} /api/chef/invoice/list
   * @desc package purchase list
   * @access Private
   * **/
  .get(invoiceController.allInvoices);

export default routes;
