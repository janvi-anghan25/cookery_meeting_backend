import { logger, level } from '../../config/logger';
import portfolioQnaModel from '../../models/portfolio_qna';
import portfolioModel from '../../models/portfolio';

export const addQuestion = async (user_id, query, body) => {
  logger.log(level.info, `>> addQuestion()`);

  let { portfolio_id } = query;
  let { question } = body;

  let portfolioData = await portfolioModel.get({portfolio_id});

  if (portfolioData && portfolioData.length > 0) {
    let qnaData = {
      user_id,
      question,
      portfolio_id,
      chef_id: portfolioData[0].chef_id,
    };

    await portfolioQnaModel.add(qnaData);

    const data = {
      message: 'succ_198',
    };
    return data;
  }
};

export const getAllQNA = async (query, options) => {
  logger.log(level.info, `>> getAllQNA()`);

  let { portfolio_id } = query;
  const filterQNA = {
    portfolio_id,
    is_answer: true,
  };

  let qnaData = await portfolioQnaModel.get(filterQNA, '', options);
  let count = await portfolioQnaModel.count(filterQNA);
  let data = {};

  if (qnaData && qnaData.length > 0) {
    data = {
      message: 'succ_197',
      count,
      data: qnaData,
    };
  } else {
    data = {
      message: 'succ_197',
      count: 0,
      data: [],
    };
  }
  return data;
};


