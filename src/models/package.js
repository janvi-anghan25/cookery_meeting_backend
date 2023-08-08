import DBOperation from '../services/database/database_operation';
import { v4 as uuidv4 } from 'uuid';
import SchemaModel from '../services/database/schema_model';

/**
 * STATUS
 * 0 - isInActive
 * 1 - Active
 * 2 - deleted
 */
const schema = {
  package_id: {
    type: String,
    default: uuidv4,
  },
  package_name: {
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
  currency: {
    type: String,
    default: 'usd',
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: Number,
    enum: [0, 1, 2],
    default: 1,
  },
  is_default: {
    type: Boolean,
    default: false,
  },
};

const modelName = 'packages';
export let packages = DBOperation.createModel(modelName, schema);

let packageModel = new SchemaModel(packages);

export default packageModel;
