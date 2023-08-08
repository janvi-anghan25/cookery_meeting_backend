import { logger, level } from '../../config/logger';
import contactUsModel from '../../models/contact_us';

export const contactUsForm = async (user_id, body, query) => {
  logger.log(level.info, `>> contactUsForm()`);
  const { message, fullName, email } = body;

  let contactUsData = {
    fullName,
    email,
    message: message,
    customer_id: user_id,
    role: 'user',
  };

  if (query.chef_id) {
    contactUsData.chef_id = query.chef_id;
  }

  await contactUsModel.add(contactUsData);

  const data = {
    message: 'succ_191',
  };

  return data;
};
