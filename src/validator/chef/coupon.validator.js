import { body, oneOf, query } from 'express-validator';
import { constants as VALIDATOR } from '../../constant/validator/coupon';
import couponModel from '../../models/coupon';

export const validate = (method) => {
  let error = [];
  switch (method) {
    case VALIDATOR.ADD_COUPON: {
      error = [
        body('name', 'err_142').not().isEmpty(),
        body('max_redemptions', 'err_143').not().isEmpty(),
        oneOf([
          body('percent_off', 'err_144').not().isEmpty(),
          body('amount_off', 'err_144').not().isEmpty(),
        ]),
        body('expired_at', 'err_145').not().isEmpty(),
      ];
      break;
    }

    case VALIDATOR.GET_COUPON: {
      error = [
        query('coupon_code', 'err_146').not().isEmpty().custom(isCouponExist),
      ];
      break;
    }

    case VALIDATOR.EDIT_COUPON_STATUS: {
      error = [
        body('status', 'err_149').not().isEmpty(),
        query('coupon_id', 'err_148').not().isEmpty().custom(isCouponIdExist),
      ];
      break;
    }

    case VALIDATOR.DELETE_COUPON: {
      error = [
        query('coupon_code', 'err_146').not().isEmpty().custom(isCouponExist),
      ];
      break;
    }
  }
  return error;
};

const isCouponExist = async (value) => {
  let isCouponExist = await couponModel.isExist({ coupon_code: value });
  if (isCouponExist) {
    return value;
  }

  throw new Error('err_147');
};

const isCouponIdExist = async (value) => {
  let isCouponExist = await couponModel.isExist({ coupon_id: value });
  if (isCouponExist) {
    return value;
  }

  throw new Error('err_147');
};
