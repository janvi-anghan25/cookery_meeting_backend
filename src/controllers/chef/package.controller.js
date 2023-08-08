import { level, logger } from '../../config/logger';
import {
  serverError,
  successResponse,
  badRequestError,
  getOptionsJson,
  standardStructureStringToJson,
} from '../../utils/utility';

import * as packageRepo from '../../repositories/chef/package';
import { validationResult } from 'express-validator';

export const getAllPackage = async (req, res) => {
  logger.log(level.debug, `>> getAllPackage()`);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsJson(extraParams);
  try {
    let result = await packageRepo.getAllPackage(options);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getAllPackage() error=${error}`);
    serverError(res);
  }
};

export const getPackageDetails = async (req, res) => {
  logger.log(level.debug, `>> getPackageDetails()`);
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await packageRepo.getPackageDetails(req.query.package_id);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getPackageDetails()`);
    serverError(res);
  }
};

export const buyPackage = async (req, res) => {
  logger.log(level.debug, `>> buyPackage()`);
  const errors = validationResult(req);
  let { chef_id, email } = req.currentChef;
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }
    let result = await packageRepo.buyPackage(chef_id, req.query, req.body);

    if (result.error) {
      return badRequestError(res, result.message);
    }
    await packageRepo.packagePurchaseMail(email);

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< buyPackage()`);
    serverError(res);
  }
};

export const activePackage = async (req, res) => {
  logger.log(level.debug, `>> activePackage()`);
  let { chef_id } = req.currentChef;
  try {
    let result = await packageRepo.activePackage(chef_id);

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< activePackage()`);
    serverError(res);
  }
};
