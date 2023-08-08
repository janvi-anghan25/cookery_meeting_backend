import DBOperation from '../services/database/database_operation';
import { v4 as uuidv4 } from 'uuid';
import SchemaModel from '../services/database/schema_model';

/**
 * STATUS
 * 0 - isInActive
 * 1 - Active
 * 2 - deleted
 */
const schema = {
  portfolio_id: {
    type: String,
    default: uuidv4,
  },
  chef_id: {
    type: String,
    ref: 'chef',
  },
  portfolio_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  recipeAndTime: [
    {
      _id: false,
      time: String,
      recipe: {
        type: String,
        ref: 'recipe',
      },
    },
  ],
  amount: [
    {
      _id: false,
      people: {
        type: Number,
      },
      price: {
        type: Number,
      },
    },
  ],
  currency: {
    type: String,
    default: 'usd',
  },
  images: [String],
  status: {
    type: Number,
    enum: [0, 1, 2],
    default: 0,
  },
  is_default: {
    type: Boolean,
    default: false,
  },
};

const modelName = 'portfolios';
export let portfolios = DBOperation.createModel(modelName, schema);

let portfolioModel = new SchemaModel(portfolios);

export default portfolioModel;
