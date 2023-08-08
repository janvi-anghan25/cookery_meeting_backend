import { logger, level } from '../../config/logger';
import {
  getOptionsJson,
  serverError,
  standardStructureStringToJson,
  successResponse,
  badRequestError,
} from '../../utils/utility';
import * as feedbackRepo from '../../repositories/admin/feedback';
import { validationResult } from 'express-validator';

export const listOfChefFeedbacks = async (req, res) => {
  logger.log(level.debug, `>> listOfChefFeedbacks()`);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsJson(extraParams);

  try {
    let feedbackData = await feedbackRepo.listOfChefFeedbacks(options);
    successResponse(res, feedbackData);
  } catch (error) {
    logger.log(level.error, `<< listOfChefFeedbacks Error = ${error}`);
    serverError(res);
  }
};

export const listOfUserFeedbacks = async (req, res) => {
  logger.log(level.debug, `>> listOfUserFeedbacks()`);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsJson(extraParams);

  try {
    let feedbackData = await feedbackRepo.listOfUserFeedbacks(options);
    successResponse(res, feedbackData);
  } catch (error) {
    logger.log(level.error, `<< listOfUserFeedbacks Error = ${error}`);
    serverError(res);
  }
};

export const updateFeedbackStatus = async (req, res) => {
  logger.log(level.debug, `>> updateFeedbackStatus()`);
  let errors = validationResult(req);

  try {
    if (!errors.isEmpty()) return badRequestError(res, errors);
    let feedbackData = await feedbackRepo.updateFeedbackStatus(
      req.query,
      req.body
    );
    successResponse(res, feedbackData);
  } catch (error) {
    logger.log(level.error, `<< updateFeedbackStatus Error = ${error}`);
    serverError(res);
  }
};
