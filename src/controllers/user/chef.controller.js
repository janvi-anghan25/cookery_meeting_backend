import { level, logger } from '../../config/logger';
import {
  serverError,
  successResponse,
  getOptionsPipelineJson,
  regexSpecialChar,
  standardStructureStringToJson,
  badRequestError,
} from '../../utils/utility';
import * as chefRepo from '../../repositories/user/chef';
import { validationResult } from 'express-validator';

export const getAllChef = async (req, res) => {
  logger.log(level.debug, `>> getAllChef()`);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsPipelineJson(extraParams);
  let filter = {};
  let regExpPattern;
  if (req.query.search) {
    regExpPattern = regexSpecialChar(req.query.search);
    regExpPattern = regExpPattern.replace(/\s+/g, '');

    filter = {
      $or: [
        { firstname: { $regex: regExpPattern, $options: 'i' } },
        { lastname: { $regex: regExpPattern, $options: 'i' } },
        { fullname: { $regex: regExpPattern, $options: 'i' } },
      ],
    };
  }

  try {
    let result = await chefRepo.getAllChef(filter, options);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getAllChef() error=${error}`);
    serverError(res);
  }
};

export const getChefDetails = async (req, res) => {
  logger.log(level.debug, `>> getChefDetails()`);
  let errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await chefRepo.getChefDetails(req.query.chef_id);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getChefDetails() error=${error}`);
    serverError(res);
  }
};

export const topChefList = async (req, res) => {
  logger.log(level.debug, `>> topChefList()`);
  try {
    let result = await chefRepo.topChefList(req.query.top);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< topChefList() error=${error}`);
    serverError(res);
  }
};

export const addRatingToChef = async (req, res) => {
  logger.log(level.debug, `>> addRatingToChef()`);
  let errors = validationResult(req);
  let { user_id } = req.currentUser;
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await chefRepo.addRatingToChef(
      user_id,
      req.body,
      req.query.chef_id
    );

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< addRatingToChef() error=${error}`);
    serverError(res);
  }
};

export const getChefsRating = async (req, res) => {
  logger.log(level.debug, `>> getChefsRating()`);
  let errors = validationResult(req);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsPipelineJson(extraParams);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await chefRepo.getChefsRating(req.query.chef_id, options);

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getChefsRating() error=${error}`);
    serverError(res);
  }
};
