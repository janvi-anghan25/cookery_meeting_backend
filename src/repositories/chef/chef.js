import crypto from 'crypto';
import { encrypt, decrypt, orderOTPGenerator } from '../../utils/utility';
import chefModel from '../../models/chef';
import { logger, level } from '../../config/logger';
import { sendMailToChef } from '../../controllers/chef/chef.controller';
import JWTAuth from '../../services/jwt_auth/jwt_auth';
import _ from 'lodash';
import { country_code } from '../../constant/country_code';
import * as stripeService from '../../services/stripe/stripe';
import recipeModel from '../../models/recipe';
import portfolioModel from '../../models/portfolio';
import * as chefPipeline from '../../aggregate_pipeline/chef/chef';
import chefPurchasePlanModel from '../../models/package_purchase';
import orderModel from '../../models/order';

export const verifyChefOTP = async (body, chefDoc) => {
  logger.log(level.info, `>> verifyChefOTP `);
  let { otp, email } = body;

  if (chefDoc && chefDoc.otp && chefDoc.otp === otp) {
    const tokenFilter = { email, otp };
    const updateUserFields = {
      status: 1,
    };
    const removeFields = { verification_token: '', otp: '' };
    await chefModel.update(tokenFilter, {
      $set: updateUserFields,
      $unset: removeFields,
    });
    return true;
  } else {
    return false;
  }
};

export const registerChef = async (body) => {
  logger.log(level.info, `>> registerChef body=${JSON.stringify(body)}`);
  const encryptPassword = await encrypt(body.password);
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const otp = orderOTPGenerator();

  let countryCode = country_code[body.country];
  const chef = await chefModel.add({
    ...body,
    country_code: countryCode,
    password: encryptPassword,
    verification_token: verificationToken,
    otp,
  });
  return chef;
};

export const verifyChefEmail = async (params) => {
  logger.log(level.info, `>> verifyChefEmail params=${JSON.stringify(params)}`);
  const verificationToken = params.verification_token;
  const tokenFilter = {
    $or: [
      { verification_token: verificationToken },
      { otp: verificationToken },
    ],
  };
  let chefDoc = await chefModel.isExist(tokenFilter);
  if (chefDoc) {
    // const newVerificationToken = crypto.randomBytes(32).toString('hex');
    const updateUserFields = {
      //   verification_token: newVerificationToken,
      status: 1,
    };

    const removeFields = { verification_token: '', otp: '' };
    let user = await chefModel.update(tokenFilter, {
      $set: updateUserFields,
      $unset: removeFields,
    });
    return user;
  }
  return false;
};

export const loginChef = async (body) => {
  logger.log(level.info, `>> loginChef()`);

  let object;
  let { email, password } = body;

  const [chefDoc] = await chefModel.get({
    email,
  });

  const decryptPassword = await decrypt(password, chefDoc.password);
  if (decryptPassword) {
    const tokenPayload = {
      id: chefDoc._id,
      chef_id: chefDoc.chef_id,
      email: chefDoc.email,
      firstname: chefDoc.firstname,
      lastname: chefDoc.lastname,
    };
    const auth = new JWTAuth();
    const accessToken = await auth.createToken(tokenPayload);

    let payload = {
      ...tokenPayload,
      accessToken,
    };

    object = {
      message: 'succ_2',
      data: payload,
    };
  }
  let data = { object, decryptPassword };
  return data;
};

export const sendVerificationEmail = async (email) => {
  const newVerificationToken = crypto.randomBytes(32).toString('hex');
  const otp = orderOTPGenerator();
  const updateUserField = {
    verification_token: newVerificationToken,
    otp,
    verify: false,
  };
  const updatedUser = await chefModel.update({ email }, updateUserField);
  logger.log(level.info, `>> sendVerificationEmail updatedUser=${updatedUser}`);

  sendMailToChef(updatedUser);

  throw new Error('err_12');
};

export const forgetPassword = async (params) => {
  let { email } = params;
  const token = crypto.randomBytes(32).toString('hex');
  let password_reset_otp = orderOTPGenerator();
  const updateToken = { password_reset_token: token, password_reset_otp };
  const updateUser = await chefModel.update({ email }, updateToken);
  return updateUser;
};

export const changePassword = async (body) => {
  const { newPassword, token } = body;
  const tokenFilter = { password_reset_token: token };
  const encryptPassword = await encrypt(newPassword);
  const updatePassword = {
    password: encryptPassword,
  };
  let removeField = { password_reset_token: '', password_reset_otp: '' };
  const updatedUser = await chefModel.update(tokenFilter, {
    $set: updatePassword,
    $unset: removeField,
  });
  return updatedUser;
};

export const resetPwdOTP = async (body, chefDoc) => {
  const { email, newPassword, password_reset_otp } = body;
  if (
    chefDoc &&
    chefDoc.password_reset_otp &&
    chefDoc.password_reset_otp === password_reset_otp
  ) {
    const tokenFilter = { password_reset_otp, email };
    const encryptPassword = await encrypt(newPassword);
    const updatePassword = {
      password: encryptPassword,
    };
    let removeField = { password_reset_token: '', password_reset_otp: '' };
    await chefModel.update(tokenFilter, {
      $set: updatePassword,
      $unset: removeField,
    });
    return true;
  } else {
    return false;
  }
};

export const myAccount = async (chef_id) => {
  logger.log(level.info, `>> myAccount()`);
  let excludedFields =
    '-password_reset_token -password_reset_otp -role -verify -is_active -password -is_deleted -verification_token -created_at -updated_at -__v';

  let [getMyAccount] = await chefModel.get(
    { chef_id, status: 1 },
    excludedFields
  );

  let getActivePackage = await chefPurchasePlanModel.get({
    package_id: getMyAccount.current_active_package,
  });

  if (getActivePackage.length > 0 && getActivePackage !== undefined) {
    getActivePackage = getActivePackage[0];
    getMyAccount.package_name = getActivePackage.package_name;
  } else {
    getMyAccount.package_name = '';
  }

  getMyAccount.package_name = getActivePackage.package_name;

  logger.log(
    level.debug,
    `>> chefAccount account data ${JSON.stringify(getMyAccount)} `
  );

  const data = {
    getMyAccount,
    package_name: getActivePackage.package_name,
  };

  return data;
};

export const updateAccount = async (filter, updateData) => {
  updateData = _.pickBy(updateData);
  let updatedUser = await chefModel.update(filter, {
    $set: updateData,
  });

  return updatedUser;
};

export const deleteMyAccount = async (chef_id) => {
  logger.log(level.info, `>> deleteMyAccount()`);
  const filterChef = { chef_id, status: 1 };
  const orderExist = await orderModel.isExist({
    chef_id,
    $or: [
      { status: { $eq: 1 } },
      { status: { $eq: 2 } },
      { status: { $eq: 3 } },
    ],
  });
  let data = {};
  if (!orderExist) {
    await Promise.all([
      chefModel.update(filterChef, { $set: { status: 3 } }),
      recipeModel.updateMany({ chef_id }, { $set: { status: 2 } }),
      portfolioModel.updateMany({ chef_id }, { $set: { status: 2 } }),
    ]);
    data = {
      error: false,
      message: 'succ_9',
    };
    return data;
  }
  data = {
    error: true,
    message: 'err_20',
  };
  return data;
};

export const getChefData = async (filter = {}) => {
  let chefData = await chefModel.get(filter);
  let data = {};
  let isChef = false;

  if (chefData && chefData.length > 0) {
    isChef = true;
    chefData = chefData[0];
    data = { chefData, isChef };
  } else {
    data = { isChef };
  }
  return data;
};

export const updatePublishStatus = async (chef_id, body) => {
  logger.log(level.info, `>> updatePublishStatus()`);
  let data = {};

  if (body.status) {
    let stripe_response = await checkActionEligibility(chef_id);
    if (!stripe_response) {
      data = {
        error: true,
        message: 'err_81',
      };
      return data;
    }
    chefModel.update({ chef_id }, { $set: { publish_account: true } });
  }

  if (!body.status) {
    await Promise.all([
      recipeModel.updateMany({ chef_id, status: 1 }, { $set: { status: 0 } }),
      portfolioModel.updateMany(
        { chef_id, status: 1 },
        { $set: { status: 0 } }
      ),
      chefModel.update({ chef_id }, { $set: { publish_account: false } }),
    ]);
  }

  data = {
    error: false,
    message: 'succ_8',
  };
  return data;
};

export const checkActionEligibility = async (chef_id) => {
  let [isExistChef] = await chefModel.aggregate(
    chefPipeline.eligibilityPipeline(chef_id)
  );
  let { stripe_user_id } = isExistChef;

  if (!stripe_user_id) return false;

  let accountData = await stripeService.accountInfo(stripe_user_id);
  let { charges_enabled, payouts_enabled, email } = accountData;

  let chefExist = await chefModel.isExist({
    email,
    stripe_user_id,
    chef_id,
  });

  if (!chefExist) {
    return false;
  }

  if (!charges_enabled || !payouts_enabled) return false;
  return true;
};
