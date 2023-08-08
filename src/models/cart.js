import DBOperation from '../services/database/database_operation';
import { v4 as uuidv4 } from 'uuid';
import SchemaModel from '../services/database/schema_model';
// import { encryptText, decryptText } from '../utils/utility';

/**
 * * Status
 * ? 0 Inactive
 * ? 1 Active
 * ? 2 Deleted
 */

const schema = {
  cart_id: {
    type: String,
    default: uuidv4,
  },
  user_id: {
    type: String,
  },
  status: {
    type: Number,
    enum: [0, 1, 2],
    default: 1,
  },
  ordersPortfolio: {
    _id: false,
    chef_id: String,
    portfolios: [
      {
        _id: false,
        portfolio_id: String,
        date: String,
        people: Number,
        port_id: {
          type: String,
          default: uuidv4,
        },
      },
    ],
  },
  coupon_code: String,
};

const modelName = 'cart';
export let cart = DBOperation.createModel(modelName, schema);

let cartModel = new SchemaModel(cart);

export default cartModel;
