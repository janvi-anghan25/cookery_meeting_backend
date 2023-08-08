import { logger, level } from '../../config/logger';
import {
  badRequestError,
  serverError,
  successResponse,
} from '../../utils/utility';
import * as contactUsRepo from '../../repositories/user/contact_us';
import { validationResult } from 'express-validator';

export const contactUsForm = async (req, res) => {
  logger.log(level.debug, `>> contactUsForm()`);
  const errors = validationResult(req);
  const { user_id } = req.currentUser;
  try {
    if (!errors.isEmpty()) return badRequestError(res, errors);
    let contactUsData = await contactUsRepo.contactUsForm(
      user_id,
      req.body,
      req.query
    );
    successResponse(res, contactUsData);
  } catch (error) {
    logger.log(level.error, `<< contactUsForm Error = ${error}`);
    serverError(res);
  }
};
