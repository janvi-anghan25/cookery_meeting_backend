import { level, logger } from '../../config/logger';
import {
  badRequestError,
  // getOptionsJson,
  getOptionsPipelineJson,
  regexSpecialChar,
  serverError,
  standardStructureStringToJson,
  successResponse,
} from '../../utils/utility';

import * as portfolioRepo from '../../repositories/user/portfolio';
import { validationResult } from 'express-validator';

export const getChefPortfolio = async (req, res) => {
  logger.log(level.debug, `>> getChefPortfolio()`);
  let errors = validationResult(req);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsPipelineJson(extraParams);
  let filter = {};
  filter.chef_id = req.query.chef_id;
  filter.status = 1;

  if (req.query.search) {
    let regExpPattern = regexSpecialChar(req.query.search);
    filter.portfolio_name = { $regex: regExpPattern, $options: 'i' };
  }

  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }
    let result = await portfolioRepo.getChefPortfolio(filter, options);

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getChefPortfolio() error=${error}`);
    serverError(res);
  }
};

export const listPortfolio = async (req, res) => {
  logger.log(level.debug, `>> listPortfolio()`);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsPipelineJson(extraParams);
  let filter = {};
  filter.status = 1;
  if (req.query.search) {
    let regExpPattern = regexSpecialChar(req.query.search);
    filter.portfolio_name = { $regex: regExpPattern, $options: 'i' };
  }
  try {
    let result = await portfolioRepo.listPortfolio(filter, options);

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< listPortfolio() error=${error}`);
    serverError(res);
  }
};

export const getPortfolioDetails = async (req, res) => {
  logger.log(level.debug, `>> getPortfolioDetails()`);
  let errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }
    let result = await portfolioRepo.getPortfolioDetails(req.query);

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getPortfolioDetails() error=${error}`);
    serverError(res);
  }
};

export const getChefUnavailableDates = async (req, res) => {
  logger.log(level.debug, `>> getChefUnavailableDates()`);
  let filter = {
    portfolio_id: req.query.portfolio_id,
    chef_id: req.query.chef_id,
  };
  try {
    let result = await portfolioRepo.getChefUnavailableDates(filter);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getChefUnavailableDates() error=${error}`);
    serverError(res);
  }
};

export const topPortfolioList = async (req, res) => {
  logger.log(level.debug, `>> topPortfolioList()`);
  try {
    let result = await portfolioRepo.topPortfolioList(req.query.top);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< topPortfolioList() error=${error}`);
    serverError(res);
  }
};

export const addRatingToPortfolio = async (req, res) => {
  logger.log(level.debug, `>> addRatingToPortfolio()`);
  let { user_id } = req.currentUser;
  let errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await portfolioRepo.addRatingToPortfolio(
      user_id,
      req.query.portfolio_id,
      req.body
    );

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< addRatingToPortfolio() error=${error}`);
    serverError(res);
  }
};

export const getPortfolioRating = async (req, res) => {
  logger.log(level.debug, `>> getPortfolioRating()`);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsPipelineJson(extraParams);
  let errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await portfolioRepo.getPortfolioRating(
      req.query.portfolio_id,
      options
    );

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getPortfolioRating() error=${error}`);
    serverError(res);
  }
};
