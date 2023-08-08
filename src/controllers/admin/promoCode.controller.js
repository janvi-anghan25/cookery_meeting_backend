import { level, logger } from '../../config/logger';
import * as promoCodeRepo from '../../repositories/admin/promoCode';
import {
  badRequestError,
  getOptionsJson,
  serverError,
  standardStructureStringToJson,
  successResponse,
} from '../../utils/utility';
import { validationResult } from 'express-validator';

export const createPromoCode = async (req, res) => {
  logger.log(level.debug, `>> createPromoCode()`);
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await promoCodeRepo.createPromoCode(req.body);

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< createPromoCode()`);
    serverError(res);
  }
};

export const getPromoCode = async (req, res) => {
  logger.log(level.debug, `>> getPromoCode()`);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsJson(extraParams);

  try {
    let result = await promoCodeRepo.getPromoCode(options);

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getPromoCode()`);
    serverError(res);
  }
};

export const deletePromoCode = async (req, res) => {
  logger.log(level.debug, `>> deletePromoCode()`);
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await promoCodeRepo.deletePromoCode(req.query.promo_code_id);

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< deletePromoCode()`);
    serverError(res);
  }
};
