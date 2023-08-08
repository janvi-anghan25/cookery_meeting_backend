import DBOperation from '../services/database/database_operation';
import { v4 as uuidv4 } from 'uuid';
import SchemaModel from '../services/database/schema_model';

const schema = {
  config_id: {
    type: String,
    default: uuidv4,
  },
  role: {
    type: String,
    default: 'admin',
  },
  application_fee: {
    type: String,
    required: true,
  },
};

const modelName = 'config';
export let config = DBOperation.createModel(modelName, schema);

let configModel = new SchemaModel(config);

export default configModel;
