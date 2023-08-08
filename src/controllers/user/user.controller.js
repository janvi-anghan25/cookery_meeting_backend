import { logger, level } from '../../config/logger';
import { v4 as uuidv4 } from 'uuid';
// import userModel from '../../models/user';
import { constants as APP_CONST } from '../../constant/application';
import { constants as SENDGRID_CONST } from '../../constant/sendgrid';
import sendGrid from '../../utils/sendgrid';
import { constants as API_URL } from '../../constant/api_url';
import { validationResult } from 'express-validator';
import {
  encrypt,
  decrypt,
  badRequestError,
  successResponse,
  serverError,
} from '../../utils/utility';
import { constants as WASABI_BUCKET_CONST } from '../../constant/wasabi';

import { uploadFile } from '../../services/aws/aws';
import * as userRepo from '../../repositories/user/end_user';

let { USER_EMAIL_VERIFICATION, USER_EMAIL_VERIFICATION_FAILED } = API_URL;

export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  logger.log(level.debug, `>> registerUser()`);

  try {
    if (!errors.isEmpty()) {
      badRequestError(res, errors);
    } else {
      const inserteduser = await userRepo.addUser(req.body);
      await sendMailToUser(inserteduser);
      const data = {
        message: 'succ_1',
      };
      successResponse(res, data);
    }
  } catch (e) {
    logger.log(level.error, `registerUser error=${e}`);
    serverError(res);
  }
};

export const loginUser = async (req, res) => {
  const errors = validationResult(req);
  logger.log(level.debug, `>> loginUser()`);
  logger.log(level.info, `>> loginUser body=${JSON.stringify(req.body)}`);

  try {
    if (!errors.isEmpty()) return badRequestError(res, errors);
    let { decryptPassword, object } = await userRepo.loginUser(req.body);
    if (decryptPassword) {
      successResponse(res, object);
    } else {
      badRequestError(res, 'err_13');
    }
  } catch (e) {
    logger.log(level.error, `loginUser error=${e}`);
    serverError(res);
  }
};

export const forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  logger.log(level.info, `>> forgotPassword ${JSON.stringify(req.params)}`);

  try {
    if (!errors.isEmpty()) return badRequestError(res, errors);
    const user = await userRepo.forgetPassword(req.params);

    let data = await sendForgetPasswordMail(user);
    successResponse(res, data);
  } catch (e) {
    logger.log(level.error, `forgotPassword ${JSON.stringify(req.params)}`);
    serverError(res);
  }
};

export const verifyUser = async (req, res) => {
  logger.log(level.debug, `verifyUser params=${JSON.stringify(req.params)}`);
  try {
    let userExist = await userRepo.verifyUserEmail(req.params);

    if (userExist) {
      await sendWelcomeMailToUser(userExist);
      return res.redirect(USER_EMAIL_VERIFICATION);
    } else {
      return res.redirect(USER_EMAIL_VERIFICATION_FAILED);
    }
  } catch (e) {
    logger.log(level.error, `<< verifyUser error=${e}`);
    serverError(res);
  }
};

export const changePassword = async (req, res) => {
  const errors = validationResult(req);
  logger.log(level.debug, `>> changePassword() `);
  try {
    if (!errors.isEmpty()) {
      badRequestError(res, errors);
    } else {
      await userRepo.changePassword(req.body);
      const data = {
        message: 'succ_4',
      };
      successResponse(res, data);
    }
  } catch (e) {
    logger.log(level.error, `>> changePassword ${JSON.stringify(e)}`);
    serverError(res);
  }
};

export const myAccount = async (req, res) => {
  logger.log(level.debug, `>> myAccount() `);
  const { user_id } = req.currentUser;
  try {
    let userAccount = await userRepo.userAccount(user_id);
    const data = {
      message: 'succ_6',
      data: userAccount,
    };
    successResponse(res, data);
  } catch (e) {
    logger.log(level.error, `<< myAccount ${JSON.stringify(e)}`);
    serverError(res);
  }
};

export const updateMyAccount = async (req, res) => {
  const errors = validationResult(req);
  logger.log(level.debug, `>> updateMyAccount() `);
  const { user_id } = req.currentUser;
  const filteruser = { user_id, status: 1 };

  const {
    // email,
    firstname,
    lastname,
    country,
    country_code,
    phone_number,
    oldPassword,
    newPassword,
    // confirmPassword,
  } = req.body;
  try {
    if (!errors.isEmpty()) return badRequestError(res, errors);

    logger.log(
      level.info,
      `>> updateMyAccount body=${JSON.stringify(req.body)}`
    );
    let { isUser, userData } = await userRepo.getUserData(filteruser);

    if (isUser) {
      let updateMyAccountData = {
        firstname,
        lastname,
        phone_number,
        country,
        country_code,
      };

      if (req.files) {
        if (req.files.profile_image) {
          let fileDoc = req.files.profile_image;
          let url = await uploadFile(
            fileDoc.data,
            `user-Profile-image-${uuidv4()}-${fileDoc.name}`,
            fileDoc.mimetype,
            WASABI_BUCKET_CONST.COOKEY_MEETING_BUCKET
          );
          updateMyAccountData.profile_image = url;
        }
      }

      // if (email !== userDoc.email) {
      //   logger.log(level.debug, `>> updateMyAccount changeEmail`);
      //   const isEmailExist = await storeOwnerModel.isExist({
      //     email,
      //   });

      //   if (!isEmailExist) {
      //     logger.log(level.debug, `>> updateMyAccount newEmail=${email}`);
      //     const verificationToken = crypto.randomBytes(3).toString('hex');
      //     const newEmail = email;
      //     const verify = false;
      //     updateMyAccountData.verification_token = verificationToken;
      //     updateMyAccountData.email = newEmail;
      //     updateMyAccountData.verify = verify;
      //   } else {
      //     throw 'This email is already registered.';
      //   }
      // }

      if (oldPassword && newPassword) {
        logger.log(level.debug, `>> updateMyAccount changePassword`);
        const isOldPasswordMatch = await decrypt(
          oldPassword,
          userData.password
        );

        if (isOldPasswordMatch) {
          const newStoreOwnerPassword = await encrypt(newPassword);
          updateMyAccountData.password = newStoreOwnerPassword;
        } else {
          return badRequestError(res, 'err_19');
        }
      }

      let updateduserData = await userRepo.updateAccount(
        filteruser,
        updateMyAccountData
      );
      // if (!updateduser.verify) sendMailToUser(email, updateduser);

      logger.log(
        level.info,
        `>> updateMyAccount=${JSON.stringify(updateduserData)}`
      );
      const data = {
        message: 'succ_7',
      };
      successResponse(res, data);
    } else {
      badRequestError(res, 'err_11');
    }
  } catch (e) {
    logger.log(level.error, `updateMyAccount ${JSON.stringify(e)}`);
    serverError(res);
  }
};

export const verifyOTP = async (req, res) => {
  logger.log(level.info, `>> verifyOTP `);
  logger.log(level.debug, `verifyOTP body=${JSON.stringify(req.body)}`);
  try {
    const userDoc = await userRepo.getUserData({ email: req.body.email });
    if (userDoc && !userDoc.isUser) return badRequestError(res, 'err_11');
    if (userDoc && userDoc.userData.status === 1) {
      if (userDoc.userData.status === 1) {
        let data = {
          message: 'succ_5',
        };
        return successResponse(res, data);
      }

      if (userDoc.userData.status === 2 || userDoc.userData.status === 3) {
        return badRequestError(res, 'err_15');
      }
    }

    let verifieduser = await userRepo.verifyUserOTP(req.body, userDoc.userData);

    if (verifieduser) {
      sendWelcomeMailToUser(userDoc.userData);
      let data = {
        message: 'succ_0',
      };
      return successResponse(res, data);
    } else {
      return badRequestError(res, 'err_0');
    }
  } catch (e) {
    logger.log(level.error, `<< verifyOTP error=${e}`);
    serverError(res);
  }
};

export const changePasswordOtp = async (req, res) => {
  const errors = validationResult(req);
  logger.log(level.info, `>> changePasswordOtp `);
  logger.log(
    level.debug,
    `>> changePasswordOtp body=${JSON.stringify(req.body)}`
  );
  try {
    if (!errors.isEmpty()) return badRequestError(res, errors);
    const userDoc = await userRepo.getUserData({ email: req.body.email });
    let changedPassword = await userRepo.resetPwdOTP(
      req.body,
      userDoc.userData
    );
    if (changedPassword) {
      const data = {
        message: 'succ_4',
      };
      return successResponse(res, data);
    } else {
      return badRequestError(res, 'err_0');
    }
  } catch (e) {
    logger.log(level.error, `<< changePasswordOtp error=${e}`);
    serverError(res);
  }
};

export const sendMailToUser = async (userData) => {
  let { email, verification_token, otp } = userData;
  // const from = SENDGRID_CONST.FROM;
  // const to = email;
  let emailVerificationURL =
    APP_CONST.HOST_URL + '/api/user/email_verification/' + verification_token;
  const message = {
    to: email,
    from: SENDGRID_CONST.SENDGRID_FROM,
    templateId: SENDGRID_CONST.VERIFY_TEMPLATE_ID,
    dynamic_template_data: {
      VERIFY_LINK: emailVerificationURL,
      USE_TOKEN: otp,
      APP_USERNAME: email,
      LOGO: APP_CONST.LOGO_URL,
    },
  };

  sendGrid(message);
};

const sendWelcomeMailToUser = async (user) => {
  const message = {
    to: user.email,
    from: SENDGRID_CONST.SENDGRID_FROM,
    templateId: SENDGRID_CONST.WELCOME_TEMPLATE_ID,
    dynamic_template_data: {
      APP_USERNAME: user.email,
      LOGO: APP_CONST.LOGO_URL,
    },
  };
  sendGrid(message);
};

export const sendForgetPasswordMail = async (user) => {
  let { email, password_reset_token, password_reset_otp } = user;
  let passwordResetURL =
    APP_CONST.USER_UI_URL +
    '/auth/reset-password?token=' +
    password_reset_token;
  const message = {
    to: email,
    from: SENDGRID_CONST.SENDGRID_FROM,
    templateId: SENDGRID_CONST.FORGET_TEMPLATE_ID,
    dynamic_template_data: {
      APP_USERNAME: email,
      FORGOT_PASSWORD: passwordResetURL,
      RESET_CODE: password_reset_otp,
      LOGO: APP_CONST.LOGO_URL,
    },
  };

  sendGrid(message);
  const data = {
    message: 'succ_3',
  };
  return data;
};
