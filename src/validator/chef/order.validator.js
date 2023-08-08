import { query } from 'express-validator';
import { constants as VALIDATOR } from '../../constant/validator/order';
import orderModel from '../../models/order';

export const validate = (method) => {
  let error = [];
  switch (method) {
    case VALIDATOR.ORDER_NUMBER: {
      error = [
        query('order_number', 'err_154')
          .not()
          .isEmpty()
          .custom(orderNumberExist),
      ];
      break;
    }
  }
  return error;
};

const orderNumberExist = async (value) => {
  let isOrderNumberExist = await orderModel.isExist({
    order_number: value,
    is_deleted: false,
  });
  if (isOrderNumberExist) {
    return value;
  }

  throw new Error('err_157');
};
