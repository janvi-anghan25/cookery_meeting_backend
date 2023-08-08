import { body, query } from 'express-validator';
import { constants as VALIDATOR } from '../../constant/validator/cart';
import couponModel from '../../models/coupon';
import portfolioModel from '../../models/portfolio';
import * as stripeService from '../../services/stripe/stripe';

export const validate = (method) => {
  let error = [];
  switch (method) {
    case VALIDATOR.ADD_TO_CART: {
      error = [
        body('portfolio_id', 'err_57').not().isEmpty().custom(portfolioExist),
        // body('people', 'err_116').not().isEmpty(),
        body('date', 'err_117').not().isEmpty(),
      ];
      break;
    }

    case VALIDATOR.EDIT_CART: {
      error = [
        query('portfolio_id', 'err_57').not().isEmpty().custom(portfolioExist),
        body('people', 'err_116').not().isEmpty(),
        body('date', 'err_117').not().isEmpty(),
      ];
      break;
    }

    case VALIDATOR.PORTFOLIO_ID: {
      error = [
        query('portfolio_id', 'err_57').not().isEmpty().custom(portfolioExist),
      ];
      break;
    }

    case VALIDATOR.REMOVE_CART: {
      error = [query('port_id', 'err_57').not().isEmpty()];
      break;
    }

    case VALIDATOR.COUPON: {
      error = [
        body('coupon_code', 'err_146').not().isEmpty().custom(couponExist),
      ];
      break;
    }
  }
  return error;
};

const portfolioExist = async (value) => {
  let isPortfolioExist = await portfolioModel.isExist({
    portfolio_id: value,
    status: 1,
  });
  if (!isPortfolioExist) {
    throw new Error('err_58');
  }
  return value;
};

const couponExist = async (value) => {
  let couponData = await stripeService.couponRetrieve(value);
  if (!couponData || couponData.length <= 0 || !couponData.valid) {
    throw new Error('err_147');
  }

  let isCouponExist = await couponModel.isExist({
    coupon_code: value,
    status: 1,
  });
  if (!isCouponExist) {
    throw new Error('err_147');
  }
  return value;
};
