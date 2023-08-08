import { query, body } from 'express-validator';
import { constants as VALIDATOR } from '../../constant/validator/portfolio';
import chefModel from '../../models/chef';
import portfolioModel from '../../models/portfolio';

export const validate = (method) => {
  let error = [];
  switch (method) {
    case VALIDATOR.CHEF_ID: {
      error = [query('chef_id', 'err_59').not().isEmpty().custom(chefExist)];
      break;
    }

    case VALIDATOR.PORTFOLIO_ID: {
      error = [
        query('portfolio_id', 'err_57').not().isEmpty().custom(portfolioExist),
      ];
      break;
    }

    case VALIDATOR.ADD_QUESTION: {
      error = [
        query('portfolio_id', 'err_57').not().isEmpty().custom(portfolioExist),
        body('question', 'err_196').not().isEmpty(),
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
