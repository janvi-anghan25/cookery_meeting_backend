import { logger, level } from '../../config/logger';
import faqModel from '../../models/faq';

export const addFAQ = async (body) => {
  logger.log(level.info, `>> addFAQ()`);

  const { question, answer } = body;

  await faqModel.add({ question, answer });
  const data = {
    message: 'succ_202',
  };
  return data;
};

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

export const editFAQ = async (query, body) => {
  logger.log(level.info, `>> editFAQ()`);
  let { faq_id } = query;
  let { question, answer } = body;

  await faqModel.update(
    { faq_id },
    { $set: { question: question, answer: answer } }
  );

  const data = {
    message: 'succ_204',
  };
  return data;
};

export const deleteFAQ = async (query) => {
  logger.log(level.info, `>> deleteFAQ()`);

  await faqModel.delete({ faq_id: query.faq_id });
  const data = {
    message: 'succ_205',
  };
  return data;
};
