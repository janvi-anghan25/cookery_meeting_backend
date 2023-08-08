import { logger, level } from '../../config/logger';
import {
  getOptionsJson,
  serverError,
  standardStructureStringToJson,
  successResponse,
} from '../../utils/utility';
import * as faqRepo from '../../repositories/user/faq';

export const getAllFAQ = async (req, res) => {
  logger.log(level.debug, `>> getAllFAQ()`);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsJson(extraParams);

  try {
    let faqData = await faqRepo.getAllFAQ(options);
    successResponse(res, faqData);
  } catch (error) {
    logger.log(level.error, `<< getAllFAQ error=${error}`);
    serverError(res);
  }
};
