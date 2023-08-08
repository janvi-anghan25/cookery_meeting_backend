import DBOperation from '../services/database/database_operation';
import { v4 as uuidv4 } from 'uuid';
import SchemaModel from '../services/database/schema_model';

const schema = {
  qna_id: {
    type: String,
    default: uuidv4,
  },
  question: String,
  answer: String,
  is_answer: {
    type: Boolean,
    default: false,
  },
  chef_id: {
    type: String,
    ref: 'chef',
  },
  portfolio_id: {
    type: String,
    ref: 'portfolios',
  },
  user_id: {
    type: String,
    ref: 'Users',
  },
};

const modelName = 'portfolio_qna';
export let portfolio_qna = DBOperation.createModel(modelName, schema);

let porfolioQnaModel = new SchemaModel(portfolio_qna);

export default porfolioQnaModel;
