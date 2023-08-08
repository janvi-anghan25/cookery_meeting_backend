import { body, query } from 'express-validator';
import { constants as VALIDATOR } from '../../constant/validator/portfolio';
import portfolioModel from '../../models/portfolio';
import portfolioQnaModel from '../../models/portfolio_qna';

export const validate = (method) => {
  let error = [];
  switch (method) {
    case VALIDATOR.ADD_PORTFOLIO: {
      error = [
        body('portfolio_name', 'err_53').not().isEmpty(),
        // body('category', 'err_54').not().isEmpty(),
        // body('meeting_hours', 'err_55').not().isEmpty(),
        body('amount', 'err_56').not().isEmpty(),
      ];
      break;
    }

    case VALIDATOR.PORTFOLIO_ID: {
      error = [
        query('portfolio_id', 'err_57').not().isEmpty().custom(portfolioExist),
      ];
      break;
    }

    case VALIDATOR.ADD_QNA: {
      error = [
        query('portfolio_id', 'err_57').not().isEmpty().custom(portfolioExist),
        body('question', 'err_196').not().isEmpty(),
        body('answer', 'err_197').not().isEmpty(),
      ];
      break;
    }
    case VALIDATOR.UPDATE_ANSWER: {
      error = [
        query('portfolio_id', 'err_57').not().isEmpty().custom(portfolioExist),
        query('qna_id', 'err_198').not().isEmpty().custom(QNAExist),
        body('answer', 'err_197').not().isEmpty(),
      ];
      break;
    }
    case VALIDATOR.DELETE_QNA: {
      error = [query('qna_id', 'err_198').not().isEmpty().custom(QNAExist)];
      break;
    }
  }
  return error;
};

const portfolioExist = async (value) => {
  let isPortfolioExist = await portfolioModel.isExist({ portfolio_id: value });
  if (!isPortfolioExist) {
    throw new Error('err_58');
  }
  return value;
};

const QNAExist = async (value) => {
  let isQnaExist = await portfolioQnaModel.isExist({ qna_id: value });
  if (!isQnaExist) {
    throw new Error('err_199');
  }
  return value;
};
