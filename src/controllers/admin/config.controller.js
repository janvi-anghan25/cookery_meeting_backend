import { level, logger } from '../../config/logger';
import * as configRepo from '../../repositories/admin/config';
import { serverError, successResponse } from '../../utils/utility';

export const addConfigData = async (req, res) => {
  logger.log(level.debug, `>> addConfigData()`);
  try {
    let result = await configRepo.addConfigData(req.body);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< addConfigData() error=${error}`);
    serverError(res);
  }
};

export const getConfigData = async (req, res) => {
  logger.log(level.debug, `>> getConfigData()`);
  try {
    let result = await configRepo.getConfigData();
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getConfigData() error=${error}`);
    serverError(res);
  }
};
