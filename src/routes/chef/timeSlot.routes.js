/**
 * * Chef Time Slot Routes
 */

import { Router } from 'express';
import * as timeSlotController from '../../controllers/chef/timeSlot.controller';

import { chefAuthMiddleware } from '../../middleware/authentication';
// import { validate } from '../../validator/admin/recipe_options.validator';
// import { constants as VALIDATOR } from '../../constant/validator/reciepe_options';

const routes = new Router({ mergeParams: true });

const PATH = {
  ROOT: '/',
  BOOKED: '/booked',
};

routes.use(chefAuthMiddleware);

routes
  .route(PATH.ROOT)
  /**
   * @api {POST} /api/chef/time_slot
   * @desc Add Working Days and Booked slot and not available date
   * @access Private
   * **/
  .post(timeSlotController.addWorkDay)
  /**
   * @api {GET} /api/chef/time_slot
   * @desc Get Working Days and Booked slot and not available date
   * @access Private
   * **/
  .get(timeSlotController.getWorkDay)
  /**
   * @api {PUT} /api/chef/time_slot
   * @desc Edit Working Data
   * @access Private
   * **/
  .put(timeSlotController.editWorkDay)
  /**
   * @api {DELETE} /api/chef/time_slot
   * @desc Delete Working Data
   * @access Private
   * **/
  .delete(timeSlotController.deleteWorkDay);

routes
  .route(PATH.BOOKED)
  /**
   * @api {GET} /api/chef/time_slot/booked
   * @desc Shows Booked List
   * @access Private
   * **/
  .get(timeSlotController.orderBookedList);

export default routes;
