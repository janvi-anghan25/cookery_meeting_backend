import { level, logger } from '../config/logger';
import chefTimeSlotModel from '../models/chef_time_slot';
import { badRequestError } from '../utils/utility';

export const chefMiddleware = async (req, res, next) => {
  logger.log(level.info, `>> chefMiddleware()`);
  let { chef_id } = req.currentChef;
  let isWorkDataExist = await chefTimeSlotModel.isExist({ chef_id });
  if (isWorkDataExist) {
    next();
  } else {
    return badRequestError(res, 'err_94');
  }
};
