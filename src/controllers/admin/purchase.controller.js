import { level, logger } from '../../config/logger';
import * as purchaseRepo from '../../repositories/admin/purchase';
import {
  serverError,
  successResponse,
  badRequestError,
  standardStructureStringToJson,
  getOptionsPipelineJson,
} from '../../utils/utility';
import { validationResult } from 'express-validator';

export const packagePurchasedList = async (req, res) => {
  logger.log(level.debug, `>> packagePurchasedList()`);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsPipelineJson(extraParams);
  try {
    let result = await purchaseRepo.packagePurchasedList(options);
    successResponse(res, result);
  } catch (error) {
    logger.log(
      level.error,
      `<< packagePurchasedList() error=${packagePurchasedList}`
    );
    serverError(res);
  }
};

export const packagePurchasedDetails = async (req, res) => {
  logger.log(level.debug, `>> packagePurchasedDetails()`);
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await purchaseRepo.packagePurchasedDetails(
      req.query.purchase_id
    );
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< packagePurchasedDetails() error=${error}`);
    serverError(res);
  }
};

export const promoPurchasedList = async (req, res) => {
  logger.log(level.debug, `>> promoPurchasedList()`);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsPipelineJson(extraParams);

  try {
    let promoData = await purchaseRepo.promoPurchasedList(options);
    successResponse(res, promoData);
  } catch (error) {
    logger.log(level.error, `<< promoPurchasedList Error = ${error}`);
    serverError(res);
  }
};
