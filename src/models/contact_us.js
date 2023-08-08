import DBOperation from '../services/database/database_operation';
import { v4 as uuidv4 } from 'uuid';
import SchemaModel from '../services/database/schema_model';

/**
 * ? status
 * 0 pending
 * 1 completed
 * 2 rejected
 */

const schema = {
  contact_id: {
    type: String,
    default: uuidv4,
  },
  status: {
    type: Number,
    enum: [0, 1, 2],
    default: 0,
  },
  fullName: String,
  email: String,
  message: String,
  customer_id: String,
  chef_id: String,
  role: {
    type: String,
    enum: ['chef', 'user', 'anonymous-user'],
  },
};

const modelName = 'contactUs';
export let contactUs = DBOperation.createModel(modelName, schema);

let contactUsModel = new SchemaModel(contactUs);

export default contactUsModel;
