import { level, logger } from '../../config/logger';
import { serverError, successResponse } from '../../utils/utility';
import * as dashboardRepo from '../../repositories/chef/dashboard';

export const getCardData = async (req, res) => {
  logger.log(level.debug, `>> getCardData()`);
  const { chef_id } = req.currentChef;
  try {
    const result = await dashboardRepo.getCardData(chef_id);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getCardData() error=${error}`);
    serverError(res);
  }
};

export const getOrdersChart = async (req, res) => {
  logger.log(level.debug, `>> getOrdersChart()`);
  const { chef_id } = req.currentChef;

  try {
    let orderData = await dashboardRepo.getOrdersChart(chef_id);
    successResponse(res, orderData);
  } catch (error) {
    logger.log(level.error, `<< getOrdersChart error=${error}`);
    serverError(res);
  }
};
