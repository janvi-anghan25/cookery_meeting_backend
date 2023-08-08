import { logger, level } from '../../config/logger';
import contactUsModel from '../../models/contact_us';

export const listOfChefContactUs = async (options) => {
  logger.log(level.info, `>> listOfChefContactUs()`);
  let filterChefContactUs = {
    role: 'chef',
  };

  let chefContactUsData = await contactUsModel.get(
    filterChefContactUs,
    '-__v -role',
    options
  );

  chefContactUsData = JSON.parse(JSON.stringify(chefContactUsData));

  let chefContactUs = chefContactUsData.map((contactUs) => {
    let data = { ...contactUs };
    data.status = getContactUsStatus(contactUs.status);
    return data;
  });

  const count = await contactUsModel.count(filterChefContactUs);
  let data = {
    message: 'succ_192',
    count,
    chefContactUs,
  };

  return data;
};

export const listOfCustomerContactUs = async (options) => {
  logger.log(level.info, `>> listOfCustomerContactUs()`);
  let filterUserContactUs = {
    role: 'user',
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
    userContactUs,
  };

  return data;
};

export const listOfUserContactUs = async (options) => {
  logger.log(level.info, `>> listOfUserContactUs()`);
  let filterUserContactUs = {
    role: 'anonymous-user',
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
    userContactUs,
  };

  return data;
};

export const getContactUsStatus = (value) => {
  if (value === 0) return 'Pending';
  if (value === 1) return 'Completed';
  if (value === 2) return 'Rejected';
};
