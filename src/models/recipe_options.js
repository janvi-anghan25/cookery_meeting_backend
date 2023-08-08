import DBOperation from '../services/database/database_operation';
import { v4 as uuidv4 } from 'uuid';
import SchemaModel from '../services/database/schema_model';

const schema = {
  recipe_option_id: {
    type: String,
    default: uuidv4,
  },
  option_name: {
    type: String,
    required: true,
  },
  category: [
    {
      _id: false,
      category_name: String,
    },
  ],
};

const modelName = 'recipe_options';
export let recipeOptions = DBOperation.createModel(modelName, schema);

let recipeOptionModel = new SchemaModel(recipeOptions);

export default recipeOptionModel;
