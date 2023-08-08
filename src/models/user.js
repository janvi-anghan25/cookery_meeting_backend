import DBOperation from '../services/database/database_operation';
import { v4 as uuidv4 } from 'uuid';
import SchemaModel from '../services/database/schema_model';
import { encryptText, decryptText } from '../utils/utility';

/**
 * STATUS
 * 0 - unverified
 * 1 - verified
 * 2 - inactive
 * 3 - deleted
 * 4 - banned
 * 5 - temporary disabled
 */
const schema = {
  user_id: {
    type: String,
    default: uuidv4,
  },
  status: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5],
    default: 0,
  },
  verification_token: String,
  otp: String,
  email: {
    type: String,
    unique: true,
    required: [true, 'User email is required!'],
    trim: true,
    lowercase: true,
    set: encryptText,
    get: decryptText,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  firstname: {
    type: String,
    trim: true,
  },
  lastname: {
    type: String,
    trim: true,
  },
  fullname: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    default: 'user',
  },
  country: String,
  country_code: String,
  phone_number: {
    type: String,
    trim: true,
    set: encryptText,
    get: decryptText,
  },

  profile_image: String,
  password_reset_token: String,
  password_reset_otp: String,
};

const modelName = 'Users';
export let UserModel = DBOperation.createModel(modelName, schema);

let user = new SchemaModel(UserModel);

export default user;
