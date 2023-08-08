import DBOperation from '../services/database/database_operation';
import { v4 as uuidv4 } from 'uuid';
import SchemaModel from '../services/database/schema_model';

/**
 * ? status
 * 0 pending
 * 1 completed
 * 2 rejected
 */

/**
 * ? toAdmin
 * 0 true
 * 1 false
 */

const schema = {
  feedback_id: {
    type: String,
    default: uuidv4,
  },
  status: {
    type: Number,
    enum: [0, 1, 2],
    default: 0,
  },
  chef_id: String,
  customer_id: String,
  email: String,
  role: {
    type: String,
    enum: ['chef', 'user'],
  },
  toAdmin: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
  feedback_type: String,
  title: String,
  description: String,
  image: {
    type: String,
    default: '',
  },
};

const modelName = 'feedback';
export let feedback = DBOperation.createModel(modelName, schema);

let feedbackModel = new SchemaModel(feedback);

export default feedbackModel;
