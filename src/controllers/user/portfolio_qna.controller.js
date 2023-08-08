import { logger, level } from '../../config/logger';
import {
  badRequestError,
  getOptionsJson,
  serverError,
  standardStructureStringToJson,
  successResponse,
} from '../../utils/utility';
import { validationResult } from 'express-validator';
import * as qnaRepo from '../../repositories/user/qna';

export const addQuestion = async (req, res) => {
  logger.log(level.debug, `>> addQuestion()`);
  const errors = validationResult(req);
  const { user_id } = req.currentUser;

  try {
    if (!errors.isEmpty()) {
      badRequestError(res, errors);
    } else {
      let qnaData = await qnaRepo.addQuestion(user_id, req.query, req.body);
      successResponse(res, qnaData);
    }
  } catch (error) {
    logger.log(level.error, `<< addQuestion error=${error}`);
    serverError(res);
  }
};

export const getAllQNA = async (req, res) => {
  logger.log(level.debug, `>> getAllQna()`);

  const errors = validationResult(req);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsJson(extraParams);

  try {
    if (!errors.isEmpty()) {
      badRequestError(res, errors);
    } else {
      let qnaData = await qnaRepo.getAllQNA(req.query, options);
      successResponse(res, qnaData);
    }
  } catch (error) {
    logger.log(level.error, `<< getAllQna error=${error}`);
    serverError(res);
  }
};
