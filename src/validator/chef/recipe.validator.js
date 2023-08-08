import { body, query } from 'express-validator';
import { constants as VALIDATOR } from '../../constant/validator/recipe';
import recipeModel from '../../models/recipe';

export const validate = (method) => {
  let error = [];
  switch (method) {
    case VALIDATOR.ADD_RECIPE: {
      error = [
        body('recipe_name', 'err_71').not().isEmpty(),
        body('description', 'err_71').not().isEmpty(),
        body('ingredients', 'err_73').not().isEmpty(),
      ];
      break;
    }

    case VALIDATOR.RECIPE_ID: {
      error = [
        query('recipe_id', 'err_75').not().isEmpty().custom(recipeIdExist),
      ];
      break;
    }

    case VALIDATOR.UPDATE_STATUS: {
      error = [
        query('recipe_id', 'err_75').not().isEmpty().custom(recipeIdExist),
        body('status', 'err_76').not().isEmpty(),
      ];
      break;
    }
  }
  return error;
};

const recipeIdExist = async (value) => {
  let isRecipeExist = await recipeModel.isExist({ recipe_id: value });
  if (isRecipeExist) {
    return value;
  }

  throw new Error('err_74');
};
