import DBOperation from '../services/database/database_operation';
import { v4 as uuidv4 } from 'uuid';
import SchemaModel from '../services/database/schema_model';

/**
 * STATUS
 * 0 - Unredeemed
 * 1 - Redeemed
 * 2 - expired
 * 3 - deleted
 */
const schema = {
  promo_code_id: {
    type: String,
    default: uuidv4,
  },
  promo_code_name: {
    type: String,
    required: true,
  },
  reference_name: {
    type: String,
    required: true,
  },
  maximum_portfolio: {
    type: Number,
    required: true,
  },
  maximum_recipe: {
    type: Number,
    required: true,
  },
  maximum_coupon: {
    type: Number,
    required: true,
  },
  expiry_date: {
    type: Date,
  },
  // promo_duration: {
  //   type: Number,
  //   required: true,
  // },
  promocode_value: {
    type: String,
  },
  status: {
    type: Number,
    enum: [0, 1, 2, 3],
    default: 0,
  },
  claimed_by: {
    type: String,
  },
  claim_date: {
    type: Date,
  },
  total_no_of_codes: {
    type: Number,
    required: true,
  },
  claimed_person: String,
  claimed_person_email: String,
};

const modelName = 'promo_code';
export let promoCodes = DBOperation.createModel(modelName, schema);

let promoCodeModel = new SchemaModel(promoCodes);

export default promoCodeModel;
