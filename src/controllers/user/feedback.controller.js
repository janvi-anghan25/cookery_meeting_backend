import { logger, level } from '../../config/logger';
import {
  badRequestError,
  serverError,
  successResponse,
} from '../../utils/utility';
import * as feedbackRepo from '../../repositories/user/feedback';
import { validationResult } from 'express-validator';

export const addFeedback = async (req, res) => {
  logger.log(level.debug, `>> addFeedback()`);
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) return badRequestError(res, errors);
    let feedbackData = await feedbackRepo.addFeedback(
      req.currentUser,
      req.body,
      req.files
    );
    successResponse(res, feedbackData);
  } catch (error) {
    logger.log(level.error, `<< addFeedback Error = ${error}`);
    serverError(res);
  }
};
