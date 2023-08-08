import DBOperation from '../services/database/database_operation';
import { v4 as uuidv4 } from 'uuid';
import SchemaModel from '../services/database/schema_model';

const schema = {
  rating_id: {
    type: String,
    default: uuidv4,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  chef_id: String,
  portfolio_id: String,
  recipe_id: String,
  user_id: String,
  title: String,
  review: String,
  rating_to: {
    type: String,
    enum: ['CHEF', 'RECIPE', 'PORTFOLIO'],
  },
};

const modelName = 'ratings';
export let ratings = DBOperation.createModel(modelName, schema);

let ratingsModel = new SchemaModel(ratings);

export default ratingsModel;
