import { query } from 'express-validator';
import { constants as VALIDATOR } from '../../constant/validator/order';
import orderModel from '../../models/order';
import refundModel from '../../models/refund';

export const validate = (method) => {
  let error = [];
  switch (method) {
    case VALIDATOR.CANCEL_ORDER: {
      error = [
        query('order_number', 'err_153')
          .not()
          .isEmpty()
          .custom(orderNumberExist),
      ];
      break;
    }

    case VALIDATOR.REFUND_ID: {
      error = [
        query('refund_id', 'err_155').not().isEmpty().custom(refundExist),
      ];
      break;
    }
  }
  return error;
};

const orderNumberExist = async (value) => {
  let isOrderNumberExist = await orderModel.isExist({
    order_number: value,
    refunded: false,
  });
  if (!isOrderNumberExist) {
    throw new Error('err_154');
  }
  return value;
};

const refundExist = async (value) => {
  let isRefundExist = await refundModel.isExist({ refund_id: value });
  if (!isRefundExist) {
    throw new Error('err_156');
  }
  return value;
};
