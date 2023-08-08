import { body, query } from 'express-validator';
import { constants as VALIDATOR } from '../../constant/validator/promoCode';
import promoCodeModel from '../../models/promoCode';

export const validate = (method) => {
  let error = [];
  switch (method) {
    case VALIDATOR.ADD_NEW_PROMO: {
      error = [
        body('reference_name', 'err_32').not().isEmpty(),
        body('total_no_of_codes', 'err_33')
          .not()
          .isEmpty()
          .isInt({ min: 1, max: 500 })
          .withMessage('Total Number of Code Should be Between 1 and 500'),
        body('expiry_date', 'err_34').not().isEmpty(),
        body('promo_code_name', 'err_35').not().isEmpty(),
        body('maximum_portfolio', 'err_36').not().isEmpty(),
        body('maximum_recipe', 'err_40').not().isEmpty(),
        body('maximum_coupon', 'err_65').not().isEmpty(),
        // body('promo_duration').not().isEmpty().withMessage('err_37'),
      ];

      break;
    }
    case VALIDATOR.DELETE_PROMO: {
      error = [
        query('promo_code_id', 'err_38').not().isEmpty().custom(promoCodeExist),
      ];
      break;
    }
  }
  return error;
};

const promoCodeExist = async (value) => {
  let ispromoCodeExist = await promoCodeModel.isExist({ promo_code_id: value });
  if (!ispromoCodeExist) {
    throw new Error('err_39');
  }
  return value;
};
