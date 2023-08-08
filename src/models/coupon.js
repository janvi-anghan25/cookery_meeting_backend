import DBOperation from '../services/database/database_operation';
import { v4 as uuidv4 } from 'uuid';
import SchemaModel from '../services/database/schema_model';
/**
 * ? Status
 * * 0 Inactive
 * * 1 Active
 * * 2 Expired
 * * 3 Deleted
 */

const schema = {
  coupon_id: {
    type: String,
    default: uuidv4,
  },
  chef_id: {
    type: String,
  },
  status: {
    type: Number,
    enum: [0, 1, 2, 3],
    default: 1,
  },
  coupon_code: {
    type: String,
    required: true,
  },
  duration: { type: String, default: 'once' },
  name: {
    type: String,
    required: true,
  },
  percent_off: {
    type: Number,
    min: 0,
    max: 100,
  },
  amount_off: Number,
  expired_at: Date,
};

const modelName = 'coupon';
export let coupon = DBOperation.createModel(modelName, schema);

let couponModel = new SchemaModel(coupon);

export default couponModel;
