import { body, query } from 'express-validator';
import { constants as VALIDATOR } from '../../constant/validator/feedback';
import feedbackModel from '../../models/feedback';

export const validate = (method) => {
  let error = [];
  switch (method) {
    case VALIDATOR.ADD_FEEDBACK: {
      error = [
        body('feedback_type')
          .optional({ checkFalsy: true })
          .isLength({ min: 0, max: 70 })
          .withMessage('err_181'),
        body('title')
          .optional({ checkFalsy: true })
          .isLength({ min: 0, max: 70 })
          .withMessage('err_182'),
        body('description')
          .optional({ checkFalsy: true })
          .isLength({ min: 0, max: 300 })
          .withMessage('err_183'),
      ];
      break;
    }
    case VALIDATOR.FEEDBACK_STATUS: {
      error = [
        query('feedback_id', 'err_184').not().isEmpty().custom(isFeedbackExist),
        body('feedback_status', 'err_185').not().isEmpty(),
      ];
      break;
    }
    case VALIDATOR.CONTACT_US: {
      error = [
        body('fullName')
          .optional({ checkFalsy: true })
          .isLength({ min: 0, max: 70 })
          .withMessage('err_191'),
        body('email', 'err_192').not().isEmpty(),
        body('message')
          .optional({ checkFalsy: true })
          .isLength({ min: 0, max: 300 })
          .withMessage('err_193'),
      ];
      break;
    }
  }
  return error;
};

const isFeedbackExist = async (value) => {
  const feedbackExists = await feedbackModel.isExist({ feedback_id: value });

  if (!feedbackExists) throw new Error('err_186');
  return value;
};
