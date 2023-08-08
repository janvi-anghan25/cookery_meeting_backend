import DBOperation from '../services/database/database_operation';
import { v4 as uuidv4 } from 'uuid';
import SchemaModel from '../services/database/schema_model';

/**
 * ? STATUS
 * * 0 inactive
 * * 1 active
 */

const schema = {
  purchase_id: {
    type: String,
    default: uuidv4,
  },
  type: {
    type: String,
    enum: ['PACKAGE', 'PROMO'],
    required: true,
  },
  chef_id: {
    type: String,
    ref: 'chefs',
  },
  package_name: {
    type: String,
  },
  package_id: {
    type: String,
  },
  maximum_portfolio: {
    type: Number,
  },
  remaining_portfolio: {
    type: Number,
  },
  maximum_recipe: {
    type: Number,
  },
  remaining_recipe: {
    type: Number,
  },
  maximum_coupon: {
    type: Number,
  },
  remaining_coupon: {
    type: Number,
  },
  status: {
    type: Number,
    enum: [0, 1],
  },
  payment_status: String,
  amount_spend: {
    type: Number,
    default: 0,
  },
  metadata: {
    type: Object,
  },
};

const modelName = 'chef_purchase_plan';
export let chefPurchasePlan = DBOperation.createModel(modelName, schema);

let chefPurchasePlanModel = new SchemaModel(chefPurchasePlan);

export default chefPurchasePlanModel;
