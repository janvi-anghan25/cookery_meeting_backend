import { query } from 'express-validator';
import { constants as VALIDATOR } from '../../constant/validator/recipe';
import chefModel from '../../models/chef';
import recipeModel from '../../models/recipe';

export const validate = (method) => {
  let error = [];
  switch (method) {
    case VALIDATOR.CHEF_ID: {
      error = [query('chef_id', 'err_59').not().isEmpty().custom(chefExist)];
      break;
    }

    case VALIDATOR.RECIPE_ID: {
      error = [
        query('recipe_id', 'err_75').not().isEmpty().custom(recipeExist),
      ];
      break;
    }
  }
  return error;
};

const chefExist = async (value) => {
  let isChefExist = await chefModel.isExist({ chef_id: value });
  if (!isChefExist) {
    throw new Error('err_60');
  }
  return value;
};

const recipeExist = async (value) => {
  let isRecipeExist = await recipeModel.isExist({ recipe_id: value });
  if (!isRecipeExist) {
    throw new Error('err_74');
  }
  return value;
};
