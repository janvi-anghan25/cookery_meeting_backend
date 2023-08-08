import { logger, level } from '../../config/logger';
import {
  badRequestError,
  serverError,
  successResponse,
  standardStructureStringToJson,
  getOptionsJson,
} from '../../utils/utility';
import { validationResult } from 'express-validator';
import * as qnaRepo from '../../repositories/chef/portfolio_qna';

export const addQuestionAndAnswer = async (req, res) => {
  logger.log(level.debug, `>> addQuestionAndAnswer()`);
  const errors = validationResult(req);

  const { chef_id } = req.currentChef;

  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    } else {
      const qnaData = await qnaRepo.addQuestionAndAnswer(
        chef_id,
        req.query,
        req.body
      );
      successResponse(res, qnaData);
    }
  } catch (error) {
    logger.log(level.error, `<< addQuestionAndAnswer error=${error}`);
    serverError(res);
  }
};

export const getAllQNA = async (req, res) => {
  logger.log(level.debug, `>> getAllQNA()`);
  const errors = validationResult(req);

  const { chef_id } = req.currentChef;
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsJson(extraParams);

  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }
    let qnaData = await qnaRepo.getAllQNA(chef_id, req.query, options);
    successResponse(res, qnaData);
  } catch (error) {
    logger.log(level.error, `<< getAllQNA error=${error}`);
    serverError(res);
  }
};

export const updateAnswer = async (req, res) => {
  logger.log(level.debug, `>> updateAnswer ()`);
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      badRequestError(res, errors);
    } else {
      let qnaData = await qnaRepo.updateAnswer(req.query, req.body);
      successResponse(res, qnaData);
    }
  } catch (error) {
    logger.log(level.error, `<< updateAnswer error=${error}`);
    serverError(res);
  }
};

export const deleteQNA = async (req, res) => {
  logger.log(level.debug, `>> deleteQNA()`);
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      badRequestError(res, errors);
    } else {
      let qnaData = await qnaRepo.deleteQNA(req.query);
      successResponse(res, qnaData);
    }
  } catch (error) {
    logger.log(level.error, `<< deleteQNA Error=${error}`);
  }
};
