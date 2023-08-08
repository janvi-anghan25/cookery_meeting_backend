import { logger, level } from '../../config/logger';
import { constants as APP_CONST } from '../../constant/application';
import {
  encrypt,
  decrypt,
  badRequestError,
  successResponse,
  serverError,
} from '../../utils/utility';
import { validationResult } from 'express-validator';
import { constants as WASABI_BUCKET_CONST } from '../../constant/wasabi';
import { uploadFile } from '../../services/aws/aws';
import * as adminRepo from '../../repositories/admin/admin';
import { constants as API_URL } from '../../constant/api_url';
import { v4 as uuidv4 } from 'uuid';

let { ADMIN_EMAIL_VERIFICATION, ADMIN_EMAIL_VERIFICATION_FAILED } = API_URL;

import { constants as SENDGRID_CONST } from '../../constant/sendgrid';
import sendGrid from '../../utils/sendgrid';

export const adminSignup = async (req, res) => {
  const errors = validationResult(req);
  logger.log(level.debug, `>> adminSignup()`);

  try {
    if (!errors.isEmpty()) {
      badRequestError(res, errors);
    } else {
      const insertedAdmin = await adminRepo.addAdmin(req.body);
      await sendMailToAdmin(insertedAdmin);
      const data = {
        message: 'succ_1',
      };
      successResponse(res, data);
    }
  } catch (e) {
    logger.log(level.error, `adminSignup error=${e}`);
    serverError(res);
  }
};

export const adminLogin = async (req, res) => {
  const errors = validationResult(req);
  logger.log(level.debug, `>> adminLogin()`);
  logger.log(level.info, `>> adminLogin body=${JSON.stringify(req.body)}`);

  try {
    if (!errors.isEmpty()) return badRequestError(res, errors);
    let { decryptPassword, object } = await adminRepo.loginAdmin(req.body);
    if (decryptPassword) {
      successResponse(res, object);
    } else {
      badRequestError(res, 'err_13');
    }
  } catch (e) {
    serverError(res);
  }
};

export const adminForgotPassword = async (req, res) => {
  const errors = validationResult(req);
  logger.log(
    level.info,
    `>> adminForgotPassword ${JSON.stringify(req.params)}`
  );

  try {
    if (!errors.isEmpty()) return badRequestError(res, errors);
    const user = await adminRepo.forgetPassword(req.params);

    let data = await sendForgetPasswordMail(user);
    successResponse(res, data);
  } catch (e) {
    logger.log(level.error, `forgotPassword ${JSON.stringify(req.params)}`);
    serverError(res);
  }
};

export const verifyAdmin = async (req, res) => {
  logger.log(level.debug, `verifyAdmin params=${JSON.stringify(req.params)}`);
  try {
    let adminExist = await adminRepo.verifyAdminEmail(req.params);

    if (adminExist) {
      await sendWelcomeMailToAdmin(adminExist);
      return res.redirect(ADMIN_EMAIL_VERIFICATION);
    } else {
      return res.redirect(ADMIN_EMAIL_VERIFICATION_FAILED);
    }
  } catch (e) {
    logger.log(level.error, `<< verifyAdmin error=${e}`);
    serverError(res);
  }
};

export const adminChangePassword = async (req, res) => {
  const errors = validationResult(req);
  logger.log(level.debug, `>> adminChangePassword() `);
  try {
    if (!errors.isEmpty()) {
      badRequestError(res, errors);
    } else {
      await adminRepo.changePassword(req.body);
      const data = {
        message: 'succ_4',
      };
      successResponse(res, data);
    }
  } catch (e) {
    logger.log(level.error, `>> adminChangePassword ${JSON.stringify(e)}`);
    serverError(res);
  }
};

export const myAdminAccount = async (req, res) => {
  logger.log(level.debug, `>> myAdminAccount() `);
  const { admin_id } = req.currentAdminUser;
  try {
    let userAccount = await adminRepo.adminAccount(admin_id);
    const data = {
      message: 'succ_6',
      data: userAccount,
    };
    successResponse(res, data);
  } catch (e) {
    logger.log(level.error, `<< myAdminAccount ${JSON.stringify(e)}`);
    serverError(res);
  }
};

export const updateAdminAccount = async (req, res) => {
  const errors = validationResult(req);
  logger.log(level.debug, `>> updateAdminAccount() `);
  const { admin_id } = req.currentAdminUser;
  const filterAdmin = { admin_id, status: 1 };

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
      `>> updateAdminAccount body=${JSON.stringify(req.body)}`
    );
    let { isAdmin, adminData } = await adminRepo.getAdminData(filterAdmin);

    if (isAdmin) {
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
            `admin-Profile-image-${uuidv4()}-${fileDoc.name}`,
            fileDoc.mimetype,
            WASABI_BUCKET_CONST.COOKEY_MEETING_BUCKET
          );
          updateMyAccountData.profile_image = url;
        }
      }
      //! uncomment above code for aws image storege

      // if (email !== adminDoc.email) {
      //   logger.log(level.debug, `>> updateAdminAccount changeEmail`);
      //   const isEmailExist = await storeOwnerModel.isExist({
      //     email,
      //   });

      //   if (!isEmailExist) {
      //     logger.log(level.debug, `>> updateAdminAccount newEmail=${email}`);
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
        logger.log(level.debug, `>> updateAdminAccount changePassword`);
        const isOldPasswordMatch = await decrypt(
          oldPassword,
          adminData.password
        );

        if (isOldPasswordMatch) {
          const newStoreOwnerPassword = await encrypt(newPassword);
          updateMyAccountData.password = newStoreOwnerPassword;
        } else {
          return badRequestError(res, 'err_19');
        }
      }

      let updatedAdminData = await adminRepo.updateAccount(
        filterAdmin,
        updateMyAccountData
      );
      // if (!updatedAdmin.verify) sendMailToUser(email, updatedAdmin);

      logger.log(
        level.info,
        `>> updateAdminAccount=${JSON.stringify(updatedAdminData)}`
      );
      const data = {
        message: 'succ_7',
      };
      successResponse(res, data);
    } else {
      badRequestError(res, 'err_11');
    }
  } catch (e) {
    logger.log(level.error, `updateAdminAccount ${JSON.stringify(e)}`);
    serverError(res);
  }
};

export const verifyOTP = async (req, res) => {
  logger.log(level.info, `>> verifyAdminOTP `);
  logger.log(level.debug, `verifyOTP body=${JSON.stringify(req.body)}`);
  try {
    const adminDoc = await adminRepo.getAdminData({ email: req.body.email });
    if (adminDoc && !adminDoc.isAdmin) return badRequestError(res, 'err_11');
    if (adminDoc && adminDoc.adminData.status === 1) {
      if (adminDoc.adminData.status === 1) {
        let data = {
          message: 'succ_5',
        };
        return successResponse(res, data);
      }

      if (adminDoc.adminData.status === 2 || adminDoc.adminData.status === 3) {
        return badRequestError(res, 'err_15');
      }
    }

    let verifiedAdmin = await adminRepo.verifyAdminOTP(
      req.body,
      adminDoc.adminData
    );

    if (verifiedAdmin) {
      sendWelcomeMailToAdmin(adminDoc.adminData);
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
    const adminDoc = await adminRepo.getAdminData({ email: req.body.email });
    let changedPassword = await adminRepo.resetPwdOTP(
      req.body,
      adminDoc.adminData
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

export const sendMailToAdmin = async (userData) => {
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

const sendWelcomeMailToAdmin = async (user) => {
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
    APP_CONST.SERVICE_URL +
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
