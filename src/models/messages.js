import DBOperation from '../services/database/database_operation';
import { v4 as uuidv4 } from 'uuid';
import SchemaModel from '../services/database/schema_model';

const schema = {
  room: String,
  message_id: {
    type: String,
    default: uuidv4,
  },
  users: [
    {
      user_id: {
        type: String,
      },
      name: String,
      sender_id: {
        type: String,
        default: uuidv4,
      },
    },
  ],
  messages: [
    {
      _id: false,
      user: String,
      message: String,
      created_at: { type: Date, default: Date.now },
      images: String,
      time: String,
    },
  ],
};

const modelName = 'message';
export let message = DBOperation.createModel(modelName, schema);

let MessageModel = new SchemaModel(message);

export default MessageModel;
