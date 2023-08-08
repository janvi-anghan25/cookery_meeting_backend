import DBOperation from '../services/database/database_operation';
import { v4 as uuidv4 } from 'uuid';
import SchemaModel from '../services/database/schema_model';

const schema = {
  room_id: {
    type: String,
    default: uuidv4,
  },
  chef_id: String,
  user_id: String,
  order_id: String,
};

const modelName = 'room';
export let room = DBOperation.createModel(modelName, schema);

let RoomModel = new SchemaModel(room);

export default RoomModel;
