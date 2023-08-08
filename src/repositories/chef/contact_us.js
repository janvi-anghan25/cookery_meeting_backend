import { logger, level } from '../../config/logger';
import contactUsModel from '../../models/contact_us';
import { getContactUsStatus } from '../../repositories/admin/contact_us';

export const contactUsForm = async (currentChef, body) => {
  logger.log(level.info, `>> contactUsForm()`);
  const { chef_id, role } = currentChef;
  const { fullName, email, message } = body;

  let contactUsData = {
    chef_id: chef_id,
    role,
    fullName: fullName ? fullName : '',
    email: email ? email : '',
    message: message ? message : '',
  };

  await contactUsModel.add(contactUsData);

  const data = {
    message: 'succ_191',
  };

  return data;
};

export const customerContactUs = async (chef_id, options) => {
  logger.log(level.info, `>> customerContactUs()`);
  let filterUserContactUs = {
    role: 'user',
    chef_id,
  };

  let userContactUsData = await contactUsModel.get(
    filterUserContactUs,
    '-__v -role',
    options
  );

  userContactUsData = JSON.parse(JSON.stringify(userContactUsData));

  let userContactUs = userContactUsData.map((contactUs) => {
    let data = { ...contactUs };
    data.status = getContactUsStatus(contactUs.status);
    return data;
  });

  const count = await contactUsModel.count(filterUserContactUs);
  let data = {
    message: 'succ_192',
    count,
    data: userContactUs,
  };

  return data;
};
