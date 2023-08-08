import { body, query } from 'express-validator';
import { constants as VALIDATOR } from '../../constant/validator/package';
import packageModel from '../../models/package';
import chefPurchasePlanModel from '../../models/package_purchase';

/**
 * put some field as optional
 */
export const validate = (method) => {
  let error = [];
  switch (method) {
    case VALIDATOR.CREATE_PACKAGE: {
      error = [
        body('package_name', 'err_21').not().isEmpty(),
        body('maximum_portfolio', 'err_22').not().isEmpty(),
        body('maximum_recipe', 'err_40').not().isEmpty(),
        body('maximum_coupon', 'err_65').not().isEmpty(),
        body('amount', 'err_23').not().isEmpty(),
      ];
      break;
    }

    case VALIDATOR.PACKAGE_ID: {
      error = [
        query('package_id', 'err_39').not().isEmpty().custom(packageExist),
      ];
      break;
    }

    case VALIDATOR.UPDATE_PACKAGE: {
      error = [
        query('package_id', 'err_39').not().isEmpty().custom(packageExist),
        body('status', 'err_29').not().isEmpty(),
      ];
      break;
    }

    case VALIDATOR.PURCHASED_ID: {
      error = [
        query('purchase_id', 'err_41').not().isEmpty().custom(purchasedExist),
      ];
      break;
    }
  }
  return error;
};

const packageExist = async (value) => {
  let isPackageExist = await packageModel.isExist({ package_id: value });
  if (!isPackageExist) {
    throw new Error('err_24');
  }
  return value;
};

const purchasedExist = async (value) => {
  let isPurchaseExist = await chefPurchasePlanModel.isExist({
    purchase_id: value,
  });
  if (!isPurchaseExist) {
    throw new Error('err_42');
  }
  return value;
};
