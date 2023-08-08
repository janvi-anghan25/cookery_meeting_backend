import { logger, level } from '../../config/logger';
import * as packageRepo from '../../repositories/admin/package';
import {
  badRequestError,
  serverError,
  successResponse,
  standardStructureStringToJson,
  getOptionsPipelineJson,
} from '../../utils/utility';
import { validationResult } from 'express-validator';

export const createPackage = async (req, res) => {
  logger.log(level.debug, `>> createPackage()`);
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }
    let result = await packageRepo.createPackage(req.body);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< createPackage()`);
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

    let result = await packageRepo.getPackageDetails(req.query);

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getPackageDetails()`);
    serverError(res);
  }
};

export const updatePackage = async (req, res) => {
  logger.log(level.debug, `>> updatePackage()`);
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await packageRepo.updatePackage(req.body.status, req.query);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `>> updatePackage() error=${error}`);
    serverError(res);
  }
};

export const deletePackage = async (req, res) => {
  logger.log(level.debug, `>> deletePackage()`);
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await packageRepo.deletePackage(req.query);

    if (result.error) {
      return badRequestError(res, result.message);
    }
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< deletePackage()`);
    serverError(res);
  }
};

export const myPackageList = async (req, res) => {
  logger.log(level.debug, `>> myPackageList()`);
  const errors = validationResult(req);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsPipelineJson(extraParams);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await packageRepo.myPackageList(options);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< myPackageList()`);
    serverError(res);
  }
};

export const setDefaultPackage = async (req, res) => {
  logger.log(level.debug, `>> setDefaultPackage()`);
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await packageRepo.setDefaultPackage(req.query);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< setDefaultPackage()`);
    serverError(res);
  }
};
