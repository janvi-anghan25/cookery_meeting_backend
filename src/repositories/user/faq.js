import { logger, level } from '../../config/logger';
import faqModel from '../../models/faq';

export const getAllFAQ = async (options) => {
  logger.log(level.info, `>> getAllFAQ()`);
  let data = {};

  let faqData = await faqModel.get({}, '', options);
  let count = await faqModel.count();
  if (faqData && faqData.length > 0) {
    data = {
      message: 'succ_203',
      count,
      data: faqData,
    };
  } else {
    data = {
      message: 'succ_203',
      count: 0,
      data: [],
    };
  }
  return data;
};
