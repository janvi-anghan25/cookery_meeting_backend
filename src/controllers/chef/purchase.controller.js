import { level, logger } from '../../config/logger';
import * as purchaseRepo from '../../repositories/chef/purchase';
import {
  serverError,
  successResponse,
  badRequestError,
  getOptionsPipelineJson,
  standardStructureStringToJson,
} from '../../utils/utility';
import { validationResult } from 'express-validator';

export const packagePurchasedList = async (req, res) => {
  logger.log(level.debug, `>> packagePurchasedList()`);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsPipelineJson(extraParams);
  let { chef_id } = req.currentChef;

  try {
    let result = await purchaseRepo.packagePurchasedList(chef_id, options);
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
  let { chef_id } = req.currentChef;
  let filter = { chef_id, purchase_id: req.query.purchase_id };
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await purchaseRepo.packagePurchasedDetails(filter);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< packagePurchasedDetails() error=${error}`);
    serverError(res);
  }
};
