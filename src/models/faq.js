import DBOperation from '../services/database/database_operation';
import { v4 as uuidv4 } from 'uuid';
import SchemaModel from '../services/database/schema_model';

const schema = {
  faq_id: {
    type: String,
    default: uuidv4,
  },
  question: String,
  answer: String,
};

const modelName = 'faq';
export let faqs = DBOperation.createModel(modelName, schema);

let faqModel = new SchemaModel(faqs);

export default faqModel;
