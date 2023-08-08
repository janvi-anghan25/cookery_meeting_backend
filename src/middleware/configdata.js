import { level, logger } from '../config/logger';
import configModel from '../models/config';
import { badRequestError } from '../utils/utility';

export const configMiddleware = async (req, res, next) => {
  logger.log(level.info, `>> configMiddleware()`);

  let configData = await configModel.get({});
  if (configData && configData.length > 0) {
    next();
  } else {
    return badRequestError(res, 'err_83');
  }
};
