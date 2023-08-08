import DBOperation from '../services/database/database_operation';
import { v4 as uuidv4 } from 'uuid';
import SchemaModel from '../services/database/schema_model';
import uniqid from 'uniqid';

/**
 * ? Order
 * * 0 Inactive
 * * 1 Created
 * * 2 Pending
 * * 3 Approve
 * * 4 Rejected
 * * 5 Complete
 * * 6 Incomplete
 * * 7 Canceled
 * * 8 Deleted
 */
const schema = {
  order_id: {
    type: String,
    default: uuidv4,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    default: 0,
  },
  chef_id: {
    type: String,
  },
  user_id: {
    type: String,
  },
  total_amount: {
    type: String,
    required: true,
  },
  order_otp: {
    type: String,
  },
  captured: Boolean,
  payment_intent: String,
  coupon_code: String,
  amount_discount: {
    type: Number,
    default: 0,
  },
  billing_address: {
    address: {
      city: { type: String, default: null },
      country: { type: String, default: null },
      line1: { type: String, default: null },
      line2: { type: String, default: null },
      postal_code: { type: String, default: null },
      state: { type: String, default: null },
    },
  },
  shipping_address: {
    address: {
      city: { type: String, default: null },
      country: { type: String, default: null },
      line1: { type: String, default: null },
      line2: { type: String, default: null },
      postal_code: { type: String, default: null },
      state: { type: String, default: null },
    },
  },
  order_number: {
    type: String,
    default: uniqid(),
  },
  refunded: Boolean,
  receipt_url: String,
  refund_invoice_url: String,
  portfolios: [
    {
      _id: false,
      meeting_status: {
        type: Number,
        enum: [1, 5, 6, 7],
        default: 1,
      },
      portfolio_name: String,
      portfolio_id: String,
      date: String,
      people: Number,
      portfolio_price: Number,
      images: [String],
      amount: Number,
    },
  ],
};

const modelName = 'order';
export let order = DBOperation.createModel(modelName, schema);

let orderModel = new SchemaModel(order);

export default orderModel;
