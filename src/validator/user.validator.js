import { body, param /*check, query,*/ } from 'express-validator';
import { constants as VALIDATOR } from '../constant/validator/user';
import userModel from '../models/user';
import { sendVerificationEmail } from '../repositories/user/end_user';

/**
 * put some field as optional
 */
export const validate = (method) => {
  let error = [];
  switch (method) {
    case VALIDATOR.REGISTER_USER: {
      error = [
        body('email', 'err_7').isEmail().custom(isEmailRegistered),
        body('firstname', 'err_1').not().isEmpty(),
        // body('lastname', 'err_2').not().isEmpty(),
        // body('phone_number', 'err_4').not().isEmpty(),
        // body('country', 'err_5').not().isEmpty(),
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
    case VALIDATOR.LOGIN_USER: {
      error = [
        body('email', 'err_7').isEmail().custom(emailValidation),
        body('password', 'err_8').isLength({ min: 8 }),
      ];
      break;
    }
    case VALIDATOR.FORGOT_PASSWORD: {
      error = [param('email', 'err_7').isEmail().custom(emailValidation)];
      break;
    }
    case VALIDATOR.CHANGE_PASSWORD: {
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
  }
  return error;
};

const isEmailRegistered = async (value) => {
  let emailExist = await userModel.isExist({
    email: value,
  });

  if (emailExist) throw new Error('err_10');
  return value;
};

const emailValidation = async (value) => {
  let userExist = await userModel.get({
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
  let userExist = await userModel.isExist({
    password_reset_token: value,
  });

  if (!userExist) throw new Error('err_18');

  return userExist;
};
