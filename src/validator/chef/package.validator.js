import { query, body } from 'express-validator';
import { constants as VALIDATOR } from '../../constant/validator/package';
import chefInvoiceModel from '../../models/chef_invoice';
import packageModel from '../../models/package';
import chefPurchasePlanModel from '../../models/package_purchase';

/**
 * put some field as optional
 */
export const validate = (method) => {
  let error = [];
  switch (method) {
    case VALIDATOR.PACKAGE_ID: {
      error = [
        query('package_id', 'err_39').not().isEmpty().custom(packageExist),
      ];
      break;
    }

    case VALIDATOR.PURCHASED_ID: {
      error = [
        query('purchase_id', 'err_41').not().isEmpty().custom(purchasedExist),
      ];
      break;
    }

    case VALIDATOR.INVOICE_ID: {
      error = [
        query('invoice_id', 'err_101').not().isEmpty().custom(invoiceExist),
      ];
      break;
    }

    case VALIDATOR.APPLY_PROMO: {
      error = [body('promocode_value', 'err_50').not().isEmpty()];
      break;
    }
  }
  return error;
};

const packageExist = async (value) => {
  let isPackageExist = await packageModel.isExist({
    package_id: value,
    status: 1,
  });
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

const invoiceExist = async (value) => {
  let isInvoiceExist = await chefInvoiceModel.isExist({
    purchase_id: value,
  });
  if (!isInvoiceExist) {
    throw new Error('err_102');
  }
  return value;
};
