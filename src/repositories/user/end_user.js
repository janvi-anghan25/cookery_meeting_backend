import crypto from 'crypto';
import {
  encrypt,
  decrypt,
  orderOTPGenerator,
  // encryptData,
} from '../../utils/utility';
import userModel from '../../models/user';
import { logger, level } from '../../config/logger';
import { sendMailToUser } from '../../controllers/user/user.controller';
import JWTAuth from '../../services/jwt_auth/jwt_auth';
import _ from 'lodash';

export const getUserData = async (filter = {}) => {
  let userData = await userModel.get(filter);
  let data = {};
  let isUser = false;

  if (userData && userData.length > 0) {
    isUser = true;
    userData = userData[0];
    data = { userData, isUser };
  } else {
    data = { isUser };
  }
  return data;
};

export const verifyUserOTP = async (body, userDoc) => {
  logger.log(level.info, `>> verifyUserOTP `);
  let { otp, email } = body;

  if (userDoc && userDoc.otp && userDoc.otp === otp) {
    const tokenFilter = { email, otp };
    const updateUserFields = {
      status: 1,
    };
    const removeFields = { verification_token: '', otp: '' };
    await userModel.update(tokenFilter, {
      $set: updateUserFields,
      $unset: removeFields,
    });
    return true;
  } else {
    return false;
  }
};

export const addUser = async (body) => {
  logger.log(level.info, `>> addUser body=${JSON.stringify(body)}`);
  const encryptPassword = await encrypt(body.password);
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const otp = orderOTPGenerator();
  const user = await userModel.add({
    ...body,
    password: encryptPassword,
    verification_token: verificationToken,
    otp,
  });
  // ! Comment above lines and Uncomment below 2 lines if want to use micro service
  // let encryptedData = await encryptData(body);
  // const user = await userModel.add(encryptedData);
  return user;
};

export const verifyUserEmail = async (params) => {
  logger.log(level.info, `>> verifyUserEmail params=${JSON.stringify(params)}`);
  const verificationToken = params.verification_token;
  const tokenFilter = { verification_token: verificationToken };
  let userDoc = await userModel.isExist(tokenFilter);
  if (userDoc) {
    // const newVerificationToken = crypto.randomBytes(32).toString('hex');
    const updateUserFields = {
      //   verification_token: newVerificationToken,
      status: 1,
    };

    const removeFields = { verification_token: '', otp: '' };
    let user = await userModel.update(tokenFilter, {
      $set: updateUserFields,
      $unset: removeFields,
    });
    return user;
  }
  return false;
};

export const loginUser = async (body) => {
  let object;
  let { email, password } = body;

  const [userDoc] = await userModel.get({
    email,
  });
  const decryptPassword = await decrypt(password, userDoc.password);
  if (decryptPassword) {
    const tokenPayload = {
      id: userDoc._id,
      user_id: userDoc.user_id,
      email: userDoc.email,
      firstname: userDoc.firstname,
      lastname: userDoc.lastname,
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
  const updatedUser = await userModel.update({ email }, updateUserField);
  logger.log(level.info, `>> sendVerificationEmail updatedUser=${updatedUser}`);

  sendMailToUser(updatedUser);

  throw new Error('err_12');
};

export const forgetPassword = async (params) => {
  let { email } = params;
  const token = crypto.randomBytes(32).toString('hex');
  let password_reset_otp = orderOTPGenerator();
  const updateToken = { password_reset_token: token, password_reset_otp };
  const updateUser = await userModel.update({ email }, updateToken);
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
  const updatedUser = await userModel.update(tokenFilter, {
    $set: updatePassword,
    $unset: removeField,
  });
  return updatedUser;
};

export const resetPwdOTP = async (body, userDoc) => {
  const { email, newPassword, password_reset_otp } = body;
  if (
    userDoc &&
    userDoc.password_reset_otp &&
    userDoc.password_reset_otp === password_reset_otp
  ) {
    const tokenFilter = { password_reset_otp, email };
    const encryptPassword = await encrypt(newPassword);
    const updatePassword = {
      password: encryptPassword,
    };
    let removeField = { password_reset_token: '', password_reset_otp: '' };
    await userModel.update(tokenFilter, {
      $set: updatePassword,
      $unset: removeField,
    });
    return true;
  } else {
    return false;
  }
};

export const userAccount = async (userId) => {
  let excludedFields =
    '-password_reset_token -role -verify -is_active -password -is_deleted -verification_token -created_at -updated_at -__v';

  let [getMyAccount] = await userModel.get(
    { user_id: userId, status: 1 },
    excludedFields
  );

  logger.log(
    level.debug,
    `>> userAccount account data ${JSON.stringify(getMyAccount)} `
  );

  return getMyAccount;
};

export const updateAccount = async (filter, updateData) => {
  updateData = _.pickBy(updateData);
  let updatedUser = await userModel.update(filter, {
    $set: updateData,
  });

  return updatedUser;
};
