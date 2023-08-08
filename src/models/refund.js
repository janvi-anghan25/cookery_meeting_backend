import DBOperation from '../services/database/database_operation';
import { v4 as uuidv4 } from 'uuid';
import SchemaModel from '../services/database/schema_model';

const schema = {
  refund_id: {
    type: String,
    default: uuidv4,
  },
  order_number: {
    type: String,
  },
  discount_amount: Number,
  total_amount: Number,
  user_id: {
    type: String,
  },
  chef_id: String,
};

const modelName = 'refund';
export let refund = DBOperation.createModel(modelName, schema);

let refundModel = new SchemaModel(refund);

export default refundModel;
