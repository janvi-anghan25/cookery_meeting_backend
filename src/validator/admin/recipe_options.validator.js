import { body, query } from 'express-validator';
import { constants as VALIDATOR } from '../../constant/validator/reciepe_options';
import recipeOptionModel from '../../models/recipe_options';

/**
 * put some field as optional
 */
export const validate = (method) => {
  let error = [];
  switch (method) {
    case VALIDATOR.ADD_RECIPE_OPTION: {
      error = [
        body('option_name', 'err_61').not().isEmpty(),
        body('category', 'err_62').not().isEmpty(),
      ];
      break;
    }

    case VALIDATOR.RECIPE_OPTION_ID: {
      error = [
        query('recipe_option_id', 'err_64')
          .not()
          .isEmpty()
          .custom(recipeOptExist),
      ];
      break;
    }

    case VALIDATOR.EDIT_RECIPE_OPTION: {
      error = [
        query('recipe_option_id', 'err_64')
          .not()
          .isEmpty()
          .custom(recipeOptExist),
        body('option_name', 'err_61').not().isEmpty(),
        body('category', 'err_62').not().isEmpty(),
      ];
    }
  }
  return error;
};

const recipeOptExist = async (value) => {
  let isRecipeOptExist = await recipeOptionModel.isExist({
    recipe_option_id: value,
  });
  if (!isRecipeOptExist) {
    throw new Error('err_63');
  }
  return value;
};
