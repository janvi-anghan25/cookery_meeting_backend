import DBOperation from '../services/database/database_operation';
import { v4 as uuidv4 } from 'uuid';
import SchemaModel from '../services/database/schema_model';
import { encryptText, decryptText } from '../utils/utility';

const schema = {
  invoice_id: {
    type: String,
    default: uuidv4,
  },
  name: String,
  package_name: String,
  chef_id: {
    type: String,
    ref: 'Chef',
  },
  purchase_id: String,
  email: {
    type: String,
    trim: true,
    lowercase: true,
    set: encryptText,
    get: decryptText,
  },
  created_on: Date,
  amount_spend: Number,
  url: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    enum: ['PACKAGE', 'PROMO'],
    required: true,
  },
};

const modelName = 'chef_invoice';
export let chefInvoice = DBOperation.createModel(modelName, schema);

let chefInvoiceModel = new SchemaModel(chefInvoice);

export default chefInvoiceModel;
