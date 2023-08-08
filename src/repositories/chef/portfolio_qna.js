import { logger, level } from '../../config/logger';
import portfolioQnaModel from '../../models/portfolio_qna';

export const addQuestionAndAnswer = async (chef_id, query, body) => {
  logger.log(level.info, `>> addQuestionAndAnswer()`);

  const { portfolio_id } = query;
  const { question, answer } = body;

  let qnaData = {
    chef_id,
    portfolio_id,
    question,
    answer,
    is_answer: true,
  };

  await portfolioQnaModel.add(qnaData);

  const data = {
    message: 'succ_196',
  };
  return data;
};

export const getAllQNA = async (chef_id, query, options) => {
  logger.log(level.info, `>> getAllQNA()`);

  const { portfolio_id } = query;
  let filterQna = {
    portfolio_id,
    chef_id,
  };
  let data = {};

  let populateObj = [
    { path: 'user', select: 'firstname lastname email' },
    {
      path: 'chef',
      select: 'firstname lastname email',
    },
  ];

  let qnaData = await portfolioQnaModel.list(
    filterQna,
    '',
    populateObj,
    options
  );
  let count = await portfolioQnaModel.count(filterQna);

  if (qnaData && qnaData.length > 0) {
    data = {
      message: 'succ_197',
      count: count,
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

export const updateAnswer = async (query, body) => {
  logger.log(level.info, `>> updateAnswer()`);

  let { qna_id, portfolio_id } = query;
  let { answer, question } = body;
  const filterQna = {
    qna_id,
    portfolio_id,
  };
  let data = {};

  let qnaData = await portfolioQnaModel.get(filterQna);

  if (qnaData && qnaData.length > 0) {
    qnaData = qnaData[0];

    if (question === undefined) {
      await portfolioQnaModel.update(filterQna, {
        $set: { is_answer: true, answer: answer },
      });

      data = {
        message: 'succ_200',
      };
      return data;
    } else {
      await portfolioQnaModel.update(filterQna, {
        $set: { is_answer: true, answer: answer, question: question },
      });

      data = {
        message: 'succ_199',
      };
      return data;
    }
  }
};

export const deleteQNA = async (query) => {
  logger.log(level.info, `>> deleteQNA()`);

  let { qna_id } = query;

  await portfolioQnaModel.delete({ qna_id });

  const data = {
    message: 'succ_201',
  };
  return data;
};
