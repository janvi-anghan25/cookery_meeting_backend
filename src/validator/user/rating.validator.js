import { query, body } from 'express-validator';
import { constants as VALIDATOR } from '../../constant/validator/rating';
import chefModel from '../../models/chef';
import portfolioModel from '../../models/portfolio';
import recipeModel from '../../models/recipe';

export const validateRating = (method) => {
  let error = [];
  switch (method) {
    case VALIDATOR.ADD_RATING_CHEF: {
      error = [
        query('chef_id', 'err_59').not().isEmpty().custom(chefExist),
        body('rating', 'err_173').not().isEmpty(),
        body('title', 'err_174').not().isEmpty(),
        body('review', 'err_175').not().isEmpty(),
      ];
      break;
    }

    case VALIDATOR.CHEF_ID: {
      error = [query('chef_id', 'err_59').not().isEmpty().custom(chefExist)];
      break;
    }

    case VALIDATOR.ADD_RATING_PORTFOLIO: {
      error = [
        query('portfolio_id', 'err_57').not().isEmpty().custom(portfolioExist),
        body('rating', 'err_173').not().isEmpty(),
        body('title', 'err_174').not().isEmpty(),
        body('review', 'err_175').not().isEmpty(),
      ];
      break;
    }

    case VALIDATOR.PORTFOLIO_ID: {
      error = [
        query('portfolio_id', 'err_57').not().isEmpty().custom(portfolioExist),
      ];
      break;
    }

    case VALIDATOR.ADD_RATING_RECIPE: {
      error = [
        query('recipe_id', 'err_75').not().isEmpty().custom(recipeExist),
        body('rating', 'err_173').not().isEmpty(),
        body('title', 'err_174').not().isEmpty(),
        body('review', 'err_175').not().isEmpty(),
      ];
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
  let isChefExist = await chefModel.isExist({ chef_id: value, status: 1 });
  if (!isChefExist) {
    throw new Error('err_60');
  }
  return value;
};

const portfolioExist = async (value) => {
  let isPortfolioExist = await portfolioModel.isExist({
    portfolio_id: value,
    status: 1,
  });
  if (!isPortfolioExist) {
    throw new Error('err_58');
  }
  return value;
};

const recipeExist = async (value) => {
  let isRecipeExist = await recipeModel.isExist({
    recipe_id: value,
    status: 1,
  });
  if (!isRecipeExist) {
    throw new Error('err_74');
  }
  return value;
};
