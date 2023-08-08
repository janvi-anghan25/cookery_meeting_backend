import { body, header, param, query } from 'express-validator';
import { constants as VALIDATOR } from '../../constant/validator/admin';
import adminModel from '../../models/admin';
import { sendVerificationEmail } from '../../repositories/admin/admin';
import { constants as APP_CONST } from '../../constant/application';
import couponModel from '../../models/coupon';
import faqModel from '../../models/faq';

export const validate = (method) => {
  let error = [];
  switch (method) {
    case VALIDATOR.ADMIN_SIGNUP: {
      error = [
        header('secret', 'err_3').not().isEmpty().custom(secretValidation),
        body('email', 'err_7').isEmail().custom(isEmailRegistered),
        body('password')
          .isLength({ min: 8 })
          .withMessage('err_8')
          .custom((value, { req }) => {
            if (value !== req.body.confirmPassword) {
              throw new Error('err_9');
            } else {
              return value;
            }
          }),
      ];
      break;
    }
    case VALIDATOR.ADMIN_LOGIN: {
      error = [
        body('email', 'err_7').isEmail().custom(emailValidation),
        body('password', 'err_8').isLength({ min: 8 }),
      ];
      break;
    }
    case VALIDATOR.ADMIN_FORGOT_PASSWORD: {
      error = [param('email', 'err_7').isEmail().custom(emailValidation)];
      break;
    }
    case VALIDATOR.ADMIN_CHANGE_PASSWORD: {
      error = [
        body('newPassword')
          .isLength({ min: 8 })
          .withMessage('err_8')
          .custom((value, { req }) => {
            if (value !== req.body.confirmPassword) {
              throw new Error('err_9');
            } else {
              return value;
            }
          }),
        body('token', 'err_18').not().isEmpty().custom(tokenValidation),
      ];
      break;
    }
    case VALIDATOR.CHANGE_PASSWORD_OTP: {
      error = [
        body('email', 'err_7').isEmail().custom(emailValidation),
        body('newPassword')
          .isLength({ min: 8 })
          .withMessage('err_8')
          .custom((value, { req }) => {
            if (value !== req.body.confirmPassword) {
              throw new Error('err_9');
            } else {
              return value;
            }
          }),
        // body('token', 'err_18').not().isEmpty().custom(tokenValidation),
      ];
      break;
    }
    case VALIDATOR.UPDATE_ACCOUNT: {
      error = [
        body('newPassword')
          .optional({ checkFalsy: true })
          .isLength({ min: 8 })
          .withMessage('err_8'),
      ];
      break;
    }
    case VALIDATOR.DELETE_COUPON: {
      error = [
        query('coupon_code', 'err_146').not().isEmpty().custom(isCouponExist),
      ];
      break;
    }
    case VALIDATOR.ADD_FAQ: {
      error = [
        body('question', 'err_196').not().isEmpty(),
        body('answer', 'err_197').not().isEmpty(),
      ];
      break;
    }
    case VALIDATOR.EDIT_FAQ: {
      error = [
        body('question', 'err_196').not().isEmpty(),
        body('answer', 'err_197').not().isEmpty(),
        query('faq_id', 'err_200').not().isEmpty().custom(isFAQExist),
      ];
      break;
    }
    case VALIDATOR.DELETE_FAQ: {
      error = [query('faq_id', 'err_200').not().isEmpty().custom(isFAQExist)];
      break;
    }
    // case VALIDATOR.GET_ADMIN: {
    //   error = [header('secret', 'Please enter secret header.').not().isEmpty()];
    //   break;
    // }
  }
  return error;
};

const isEmailRegistered = async (value) => {
  let emailExist = await adminModel.isExist({
    email: value,
  });

  if (emailExist) throw new Error('err_10');
  return value;
};

const emailValidation = async (value) => {
  let userExist = await adminModel.get({
    email: value,
  });

  if (userExist.length === 0) throw new Error('err_11');
  let { status, oauth_provider } = userExist[0];
  if (status === 0) {
    await sendVerificationEmail(value);
  }
  if (status === 2) throw new Error('err_15');
  if (status === 3) throw new Error('err_14');
  if (oauth_provider === 'google') throw new Error('err_16');
  if (oauth_provider === 'facebook') throw new Error('err_17');

  return value;
};

const tokenValidation = async (value) => {
  let userExist = await adminModel.isExist({
    password_reset_token: value,
  });

  if (!userExist) throw new Error('err_18');

  return value;
};

const secretValidation = async (value) => {
  if (APP_CONST.ADMIN_SECRET !== value) throw new Error('err_3');
  return value;
};

const isCouponExist = async (value) => {
  let isCouponExist = await couponModel.isExist({ coupon_code: value });
  if (isCouponExist) {
    return value;
  }

  throw new Error('err_147');
};

const isFAQExist = async (value) => {
  let isFAQExist = await faqModel.isExist({ faq_id: value });
  if (isFAQExist) {
    return value;
  }

  throw new Error('err_201');
};
