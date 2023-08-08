import { logger, level } from '../../config/logger';
import feedbackModel from '../../models/feedback';
import { getFeedBackStatus } from '../../repositories/chef/feedback';

export const listOfChefFeedbacks = async (options) => {
  logger.log(level.info, `>> listOfChefFeedbacks()`);
  let filterChefFeedback = {
    role: 'chef',
    toAdmin: 0,
  };

  let chefFeedbacksData = await feedbackModel.get(
    filterChefFeedback,
    '-__v -role',
    options
  );

  chefFeedbacksData = JSON.parse(JSON.stringify(chefFeedbacksData));

  let customerFeedbacks = chefFeedbacksData.map((feedback) => {
    let data = { ...feedback };
    data.status = getFeedBackStatus(feedback.status);
    return data;
  });

  const count = await feedbackModel.count(filterChefFeedback);

  const data = {
    message: 'succ_184',
    count,
    customerFeedbacks,
  };
  return data;
};

export const listOfUserFeedbacks = async (options) => {
  logger.log(level.info, `>> listOfUserFeedbacks()`);
  let filterCustomerFeedback = {
    role: 'user',
    toAdmin: 0,
  };

  let customerFeedbacksData = await feedbackModel.get(
    filterCustomerFeedback,
    '-__v -role',
    options
  );

  customerFeedbacksData = JSON.parse(JSON.stringify(customerFeedbacksData));

  let customerFeedbacks = customerFeedbacksData.map((feedback) => {
    let data = { ...feedback };
    data.status = getFeedBackStatus(feedback.status);
    return data;
  });

  const count = await feedbackModel.count(filterCustomerFeedback);

  const data = {
    message: 'succ_184',
    count,
    customerFeedbacks,
  };
  return data;
};

export const updateFeedbackStatus = async (query, body) => {
  logger.log(level.info, `>> updateFeedbackStatus()`);
  let { feedback_id } = query;
  let { feedback_status } = body;

  await feedbackModel.update(
    { feedback_id },
    { $set: { status: feedback_status } }
  );
  const data = {
    message: 'succ_183',
  };

  return data;
};
