import { logger, level } from '../../config/logger';
import { validationResult } from 'express-validator';
import {
  serverError,
  badRequestError,
  successResponse,
  standardStructureStringToJson,
  getOptionsJson,
} from '../../utils/utility';
import * as faqRepo from '../../repositories/admin/faq';

export const addFAQ = async (req, res) => {
  logger.log(level.debug, `>> addFAQ()`);
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      badRequestError(res, errors);
    } else {
      let faqData = await faqRepo.addFAQ(req.body);
      successResponse(res, faqData);
    }
  } catch (error) {
    logger.log(level.error, `<< addFAQ error=${error}`);
    serverError(res);
  }
};

export const getAllFAQ = async (req, res) => {
  logger.log(level.debug, `>> getAllFAQ()`);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsJson(extraParams);

  try {
    let faqData = await faqRepo.getAllFAQ(options);
    successResponse(res, faqData);
  } catch (error) {
    logger.log(level.error, `<< getAllFAQ error=${error}`);
    serverError(res);
  }
};

export const editFAQ = async (req, res) => {
  logger.log(level.debug, `>> editFAQ()`);
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      badRequestError(res, errors);
    } else {
      let faqData = await faqRepo.editFAQ(req.query, req.body);
      successResponse(res, faqData);
    }
  } catch (error) {
    logger.log(level.error, `<< editFAQ error=${error}`);
    serverError(res);
  }
};

export const deleteFAQ = async (req, res) => {
  logger.log(level.debug, `>> deleteFAQ()`);
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      badRequestError(res, errors);
    } else {
      let faqData = await faqRepo.deleteFAQ(req.query);
      successResponse(res, faqData);
    }
  } catch (error) {
    logger.log(level.error, `<< deleteFAQ error=${error}`);
    serverError(res);
  }
};
