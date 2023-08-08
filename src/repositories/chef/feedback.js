import { logger, level } from '../../config/logger';
import { uploadFile } from '../../services/aws/aws';
import { v4 as uuidv4 } from 'uuid';
import { constants as WASABI_BUCKET_CONST } from '../../constant/wasabi';
import feedbackModel from '../../models/feedback';

export const addFeedback = async (currentChef, body, files) => {
  logger.log(level.info, '>> addFeedback()');
  const { chef_id, email, role } = currentChef;

  const { feedback_type, title, description } = body;

  let feedbackData = {
    chef_id,
    feedback_type,
    title,
    description,
    role,
    email,
  };

  if (files) {
    if (files.image) {
      let fileDoc = files.image;
      let url = await uploadFile(
        fileDoc.data,
        `feedback-image-${uuidv4()}-${fileDoc.name}`,
        fileDoc.mimetype,
        WASABI_BUCKET_CONST.COOKEY_MEETING_BUCKET
      );
      feedbackData.image = url;
    }
  }

  await feedbackModel.add(feedbackData);
  const data = {
    message: 'succ_182',
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

export const getAllCustomerFeedback = async (currentChef, options) => {
  logger.log(level.info, `>> getAllCustomerFeedback()`);
  let { chef_id } = currentChef;
  let filterCustomerFeedback = {
    role: 'user',
    toAdmin: 0,
    chef_id,
  };

  let feedbackData = await feedbackModel.get(
    filterCustomerFeedback,
    '-__v -role',
    options
  );

  feedbackData = JSON.parse(JSON.stringify(feedbackData));

  let customerFeedbacks = feedbackData.map((feedback) => {
    let data = { ...feedback };
    data.status = getFeedBackStatus(feedback.status);
    return data;
  });

  const count = await feedbackModel.count(filterCustomerFeedback);

  const data = {
    message: 'succ_184',
    count,
    data: customerFeedbacks,
  };
  return data;
};

export const getFeedBackStatus = (value) => {
  if (value === 0) return 'Pending';
  if (value === 1) return 'Completed';
  if (value === 2) return 'Rejected';
};
