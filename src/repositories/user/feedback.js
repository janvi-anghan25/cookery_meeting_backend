import { logger, level } from '../../config/logger';
import { uploadFile } from '../../services/aws/aws';
import { constants as WASABI_BUCKET_CONST } from '../../constant/wasabi';
import { v4 as uuidv4 } from 'uuid';
import feedbackModel from '../../models/feedback';

export const addFeedback = async (currentUser, body, files) => {
  logger.log(level.info, `>> addFeedback()`);
  const { user_id, email, role } = currentUser;
  const { feedback_type, title, description, chef_id, toAdmin } = body;

  let feedbackFormData = {
    customer_id: user_id,
    chef_id,
    feedback_type,
    title,
    description,
    role,
    email,
    toAdmin: chef_id ? Number(toAdmin) : undefined,
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
      feedbackFormData.image = url;
    }
  }

  await feedbackModel.add(feedbackFormData);
  const data = {
    message: 'succ_182',
  };

  return data;
};
