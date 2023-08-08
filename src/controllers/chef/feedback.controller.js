import { validationResult } from 'express-validator';
import { logger, level } from '../../config/logger';
import * as feedbackRepo from '../../repositories/chef/feedback';
import {
  badRequestError,
  serverError,
  standardStructureStringToJson,
  successResponse,
  getOptionsJson,
} from '../../utils/utility';

export const addFeedback = async (req, res) => {
  logger.log(level.debug, `>> addFeedback()`);
  let errors = validationResult(req);

  try {
    if (!errors.isEmpty()) return badRequestError(res, errors);
    let feedbackData = await feedbackRepo.addFeedback(
      req.currentChef,
      req.body,
      req.files
    );
    successResponse(res, feedbackData);
  } catch (error) {
    logger.log(level.error, `<< addFeedback Error = ${error}`);
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

export const getAllCustomerFeedback = async (req, res) => {
  logger.log(level.debug, `>> getAllCustomerFeedback()`);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsJson(extraParams);

  try {
    let feedbackData = await feedbackRepo.getAllCustomerFeedback(
      req.currentChef,
      options
    );
    successResponse(res, feedbackData);
  } catch (error) {
    logger.log(level.error, `<< getAllCustomerFeedback  Error = ${error}`);
    serverError(res);
  }
};
