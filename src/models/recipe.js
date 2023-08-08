import DBOperation from '../services/database/database_operation';
import { v4 as uuidv4 } from 'uuid';
import SchemaModel from '../services/database/schema_model';

/**
 * * Status
 * ? 0 Inactive
 * ? 1 Active
 * ? 2 Deleted
 */
const schema = {
  recipe_id: {
    type: String,
    default: uuidv4,
  },
  chef_id: {
    type: String,
    ref: 'Chefs',
  },
  status: {
    type: Number,
    enum: [0, 1, 2],
    default: 0,
  },
  recipe_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  ingredients: [
    {
      _id: false,
      ingredients_for: { type: String, default: null },
      ingredients_details: { type: Array, default: [] },
    },
  ],
  recipe_options: [String],
  nutritional_information: [
    {
      _id: false,
      typical_values: { type: String, default: null },
      per_serving: { type: String, default: null },
    },
  ],
  recipe_method: [
    {
      _id: false,
      title: { type: String, default: null },
      steps: [{ _id: false, step_index: Number, description: String }],
    },
  ],
  images: [String],
};

const modelName = 'recipe';
export let recipe = DBOperation.createModel(modelName, schema);

let recipeModel = new SchemaModel(recipe);

export default recipeModel;
