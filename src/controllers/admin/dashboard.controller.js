import { logger, level } from '../../config/logger';
import { serverError, successResponse } from '../../utils/utility';
import * as dashboard from '../../repositories/admin/dashboard';

export const getCardData = async (req, res) => {
  logger.log(level.info, `>> getCard()`);

  try {
    let cardData = await dashboard.getCardData();
    successResponse(res, cardData);
  } catch (error) {
    logger.log(level.error, `<< getCard Error = ${error}`);
    serverError(res);
  }
};
