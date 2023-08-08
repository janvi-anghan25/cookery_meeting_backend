import { logger, level } from '../../config/logger';
import { constants as APP_CONST } from '../../constant/application';
import { constants as API_URL } from '../../constant/api_url';

import { validationResult } from 'express-validator';
import {
  encrypt,
  decrypt,
  badRequestError,
  successResponse,
  serverError,
} from '../../utils/utility';
import { constants as SENDGRID_CONST } from '../../constant/sendgrid';
import sendGrid from '../../utils/sendgrid';
import { constants as WASABI_BUCKET_CONST } from '../../constant/wasabi';
import { uploadFile } from '../../services/aws/aws';
import * as chefRepo from '../../repositories/chef/chef';
import { v4 as uuidv4 } from 'uuid';

let { USER_EMAIL_VERIFICATION, USER_EMAIL_VERIFICATION_FAILED } = API_URL;

export const registerChef = async (req, res) => {
  const errors = validationResult(req);
  logger.log(level.debug, `>> registerChef()`);

  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    } else {
      const insertChef = await chefRepo.registerChef(req.body);
      await sendMailToChef(insertChef);
      const data = {
        message: 'succ_1',
      };
      successResponse(res, data);
    }
  } catch (e) {
    logger.log(level.error, `<< registerChef error=${e}`);
    serverError(res);
  }
};

export const loginChef = async (req, res) => {
  const errors = validationResult(req);
  logger.log(level.debug, `>> loginChef()`);
  logger.log(level.info, `>> loginChef body=${JSON.stringify(req.body)}`);

  try {
    if (!errors.isEmpty()) return badRequestError(res, errors);
    let { decryptPassword, object } = await chefRepo.loginChef(req.body);
    if (decryptPassword) {
      successResponse(res, object);
    } else {
      badRequestError(res, 'err_13');
    }
  } catch (e) {
    logger.log(level.error, `<< loginChef error=${e}`);
    serverError(res);
  }
};

export const forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  logger.log(level.info, `>> forgotPassword ${JSON.stringify(req.params)}`);

  try {
    if (!errors.isEmpty()) return badRequestError(res, errors);
    const chef = await chefRepo.forgetPassword(req.params);

    let data = await sendForgetPasswordMail(chef);
    successResponse(res, data);
  } catch (e) {
    logger.log(level.error, `<< forgotPassword ${JSON.stringify(req.params)}`);
    serverError(res);
  }
};

export const verifyChef = async (req, res) => {
  logger.log(level.debug, `>> verifyChef params=${JSON.stringify(req.params)}`);
  try {
    let chefExist = await chefRepo.verifyChefEmail(req.params);

    if (chefExist) {
      await sendWelcomeMailToChef(chefExist);
      return res.redirect(USER_EMAIL_VERIFICATION);
    } else {
      return res.redirect(USER_EMAIL_VERIFICATION_FAILED);
    }
  } catch (e) {
    logger.log(level.error, `<< verifyChef error=${e}`);
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
      await chefRepo.changePassword(req.body);
      const data = {
        message: 'succ_4',
      };
      successResponse(res, data);
    }
  } catch (e) {
    logger.log(level.error, `<< changePassword ${JSON.stringify(e)}`);
    serverError(res);
  }
};

export const myAccount = async (req, res) => {
  logger.log(level.debug, `>> myAccount() `);
  const { chef_id } = req.currentChef;

  try {
    let chefAccount = await chefRepo.myAccount(chef_id);
    const data = {
      message: 'succ_6',
      data: chefAccount,
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
  const { chef_id } = req.currentChef;
  const filterchef = { chef_id, status: 1 };

  const {
    // email,
    firstname,
    lastname,
    country,
    country_code,
    phone_number,
    oldPassword,
    newPassword,
    start_time,
    end_time,
    // confirmPassword,
  } = req.body;
  try {
    if (!errors.isEmpty()) return badRequestError(res, errors);

    logger.log(
      level.info,
      `>> updateMyAccount body=${JSON.stringify(req.body)}`
    );
    let { isChef, chefData } = await chefRepo.getChefData(filterchef);

    if (isChef) {
      let working_hours = {
        start_time,
        end_time,
      };

      let updateMyAccountData = {
        firstname,
        lastname,
        phone_number,
        country,
        country_code,
        working_hours,
      };

      if (req.files) {
        if (req.files.profile_image) {
          let fileDoc = req.files.profile_image;
          let url = await uploadFile(
            fileDoc.data,
            `chef-Profile-image-${uuidv4()}-${fileDoc.name}`,
            fileDoc.mimetype,
            WASABI_BUCKET_CONST.COOKEY_MEETING_BUCKET
          );
          updateMyAccountData.profile_image = url;
        }
      }
      //! uncomment above code for aws image storege

      // if (email !== chefDoc.email) {
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
          chefData.password
        );

        if (isOldPasswordMatch) {
          const newStoreOwnerPassword = await encrypt(newPassword);
          updateMyAccountData.password = newStoreOwnerPassword;
        } else {
          return badRequestError(res, 'err_19');
        }
      }

      let updatedchefData = await chefRepo.updateAccount(
        filterchef,
        updateMyAccountData
      );
      // if (!updatedchef.verify) sendMailToUser(email, updatedchef);

      logger.log(
        level.info,
        `>> updateMyAccount=${JSON.stringify(updatedchefData)}`
      );
      const data = {
        message: 'succ_7',
      };
      successResponse(res, data);
    } else {
      badRequestError(res, 'err_11');
    }
  } catch (e) {
    logger.log(level.error, `<< updateMyAccount ${JSON.stringify(e)}`);
    serverError(res);
  }
};

export const deleteMyAccount = async (req, res) => {
  logger.log(level.debug, `>> deleteMyAccount()`);
  const { chef_id } = req.currentChef;
  try {
    let result = await chefRepo.deleteMyAccount(chef_id);
    if (result.error) {
      return badRequestError(res, result.message);
    }
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< deleteMyAccount() error=${error}`);
    serverError(res);
  }
};

export const verifyOTP = async (req, res) => {
  logger.log(level.info, `>> verifyOTP `);
  logger.log(level.debug, `verifyOTP body=${JSON.stringify(req.body)}`);
  try {
    const chefDoc = await chefRepo.getChefData({
      email: req.body.email,
    });
    if (chefDoc && !chefDoc.isChef) return badRequestError(res, 'err_11');
    if (chefDoc && chefDoc.chefData.status === 1) {
      if (chefDoc.chefData.status === 1) {
        let data = {
          message: 'succ_5',
        };
        return successResponse(res, data);
      }

      if (chefDoc.chefData.status === 2 || chefDoc.chefData.status === 3) {
        return badRequestError(res, 'err_15');
      }
    }

    let verifiedChef = await chefRepo.verifyChefOTP(req.body, chefDoc.chefData);
    if (verifiedChef) {
      sendWelcomeMailToChef(chefDoc.chefData);
      let data = {
        message: 'succ_5',
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
    const chefDoc = await chefRepo.getUserData({
      email: req.body.email,
    });
    let changedPassword = await chefRepo.resetPwdOTP(
      req.body,
      chefDoc.chefData
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

export const updatePublishStatus = async (req, res) => {
  logger.log(level.debug, `>> updatePublishStatus()`);
  const { chef_id } = req.currentChef;
  try {
    let result = await chefRepo.updatePublishStatus(chef_id, req.body);

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< updatePublishStatus() error=${error}`);
    serverError(res);
  }
};

export const sendMailToChef = async (userData) => {
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

const sendWelcomeMailToChef = async (user) => {
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
    APP_CONST.CHEF_UI_URL +
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
