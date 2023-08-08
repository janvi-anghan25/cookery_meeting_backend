import crypto from 'crypto';
import { encrypt, decrypt, orderOTPGenerator } from '../../utils/utility';
import adminModel from '../../models/admin';
import { logger, level } from '../../config/logger';
import { sendMailToAdmin } from '../../controllers/admin/admin.controller';
import JWTAuth from '../../services/jwt_auth/jwt_auth';
import _ from 'lodash';

export const getAdminData = async (filter = {}) => {
  let adminData = await adminModel.get(filter);
  let data = {};
  let isAdmin = false;

  if (adminData && adminData.length > 0) {
    isAdmin = true;
    adminData = adminData[0];
    data = { adminData, isAdmin };
  } else {
    data = { isAdmin };
  }
  return data;
};

export const verifyAdminOTP = async (body, adminDoc) => {
  logger.log(level.info, `>> verifyAdminOTP `);
  let { otp, email } = body;

  if (adminDoc && adminDoc.otp && adminDoc.otp === otp) {
    const tokenFilter = { email, otp };
    const updateUserFields = {
      status: 1,
    };
    const removeFields = { verification_token: '', otp: '' };
    await adminModel.update(tokenFilter, {
      $set: updateUserFields,
      $unset: removeFields,
    });
    return true;
  } else {
    return false;
  }
};

export const addAdmin = async (body) => {
  logger.log(level.info, `>> addAdmin body=${JSON.stringify(body)}`);
  const encryptPassword = await encrypt(body.password);
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const otp = orderOTPGenerator();
  const admin = await adminModel.add({
    ...body,
    password: encryptPassword,
    verification_token: verificationToken,
    otp,
  });
  return admin;
};

export const verifyAdminEmail = async (params) => {
  logger.log(
    level.info,
    `>> verifyAdminEmail params=${JSON.stringify(params)}`
  );
  const verificationToken = params.verification_token;
  const tokenFilter = { verification_token: verificationToken };
  let adminDoc = await adminModel.isExist(tokenFilter);
  if (adminDoc) {
    // const newVerificationToken = crypto.randomBytes(32).toString('hex');
    const updateUserFields = {
      //   verification_token: newVerificationToken,
      status: 1,
    };

    const removeFields = { verification_token: '', otp: '' };
    let user = await adminModel.update(tokenFilter, {
      $set: updateUserFields,
      $unset: removeFields,
    });
    return user;
  }
  return false;
};

export const loginAdmin = async (body) => {
  let object;
  let { email, password } = body;

  const [adminDoc] = await adminModel.get({
    email,
  });

  const decryptPassword = await decrypt(password, adminDoc.password);
  if (decryptPassword) {
    const tokenPayload = {
      id: adminDoc._id,
      admin_id: adminDoc.admin_id,
      email: adminDoc.email,
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
  const updateAdminField = {
    verification_token: newVerificationToken,
    otp,
    verify: false,
  };
  const updatedAdmin = await adminModel.update({ email }, updateAdminField);
  logger.log(
    level.info,
    `>> sendVerificationEmail updatedAdmin=${updatedAdmin}`
  );

  sendMailToAdmin(updatedAdmin);

  throw new Error('err_12');
};

export const forgetPassword = async (params) => {
  let { email } = params;
  const token = crypto.randomBytes(32).toString('hex');
  let password_reset_otp = orderOTPGenerator();
  const updateToken = { password_reset_token: token, password_reset_otp };
  const updateUser = await adminModel.update({ email }, updateToken);
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
  const updatedAdmin = await adminModel.update(tokenFilter, {
    $set: updatePassword,
    $unset: removeField,
  });
  return updatedAdmin;
};

export const resetPwdOTP = async (body, adminDoc) => {
  const { email, newPassword, password_reset_otp } = body;
  if (
    adminDoc &&
    adminDoc.password_reset_otp &&
    adminDoc.password_reset_otp === password_reset_otp
  ) {
    const tokenFilter = { password_reset_otp, email };
    const encryptPassword = await encrypt(newPassword);
    const updatePassword = {
      password: encryptPassword,
    };
    let removeField = { password_reset_token: '', password_reset_otp: '' };
    await adminModel.update(tokenFilter, {
      $set: updatePassword,
      $unset: removeField,
    });
    return true;
  } else {
    return false;
  }
};

export const adminAccount = async (adminId) => {
  let excludedFields =
    '-password_reset_token -role -verify -is_active -password -is_deleted -verification_token -created_at -updated_at -__v';

  let [getMyAccount] = await adminModel.get(
    { admin_id: adminId, status: 1 },
    excludedFields
  );
  logger.log(
    level.debug,
    `>> adminAccount account data ${JSON.stringify(getMyAccount)} `
  );

  return getMyAccount;
};

export const updateAccount = async (filter, updateData) => {
  updateData = _.pickBy(updateData);
  let updatedAdmin = await adminModel.update(filter, {
    $set: updateData,
  });

  return updatedAdmin;
};
