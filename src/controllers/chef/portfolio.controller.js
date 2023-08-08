import { logger, level } from '../../config/logger';
import * as portfolioRepo from '../../repositories/chef/portfolio';
import {
  badRequestError,
  serverError,
  successResponse,
  getOptionsJson,
  regexSpecialChar,
  standardStructureStringToJson,
  // getOptionsPipelineJson,
} from '../../utils/utility';
import { validationResult } from 'express-validator';

export const createPortfolio = async (req, res) => {
  logger.log(level.debug, `>> createPortfolio()`);
  const errors = validationResult(req);
  let { chef_id } = req.currentChef;

  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await portfolioRepo.createPortfolio(
      chef_id,
      req.body,
      req.files
    );

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< createPortfolio()`);
    serverError(res);
  }
};

export const updatePortfolio = async (req, res) => {
  logger.log(level.debug, `>> updatePortfolio()`);
  const errors = validationResult(req);
  let { chef_id } = req.currentChef;
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await portfolioRepo.updatePortfolio(
      chef_id,
      req.query,
      req.body,
      req.files
    );

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< updatePortfolio()`);
    serverError(res);
  }
};

export const deletePortfolio = async (req, res) => {
  logger.log(level.debug, `>> deletePortfolio()`);
  const errors = validationResult(req);
  let { chef_id } = req.currentChef;
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await portfolioRepo.deletePortfolio(chef_id, req.query);

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< deletePortfolio()`);
    serverError(res);
  }
};

export const getPortfolio = async (req, res) => {
  logger.log(level.debug, `getPortfolio()`);
  const errors = validationResult(req);
  let { chef_id } = req.currentChef;
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await portfolioRepo.getPortfolio(chef_id, req.query);

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getPortfolio() error=${error}`);
    serverError(res);
  }
};

export const updatePortfolioStatus = async (req, res) => {
  logger.log(level.debug, `>> updatePortfolioStatus()`);
  const errors = validationResult(req);
  let { chef_id } = req.currentChef;
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await portfolioRepo.updatePortfolioStatus(
      chef_id,
      req.query,
      req.body
    );

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< updatePortfolioStatus() error=${error}`);
    serverError(res);
  }
};

export const listPortfolio = async (req, res) => {
  logger.log(level.debug, `>> listPortfolio()`);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsJson(extraParams);
  let { chef_id } = req.currentChef;
  let filter = {};
  filter.chef_id = chef_id;

  if (req.query.search) {
    let regExpPattern = regexSpecialChar(req.query.search);
    filter.portfolio_name = { $regex: regExpPattern, $options: 'i' };
  }

  try {
    let result = await portfolioRepo.listPortfolio(filter, options);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< listPortfolios() error=${error}`);
    serverError(res);
  }
};

export const duplicatePortfolio = async (req, res) => {
  logger.log(level.debug, `>> duplicatePortfolio()`);
  const errors = validationResult(req);
  let { chef_id } = req.currentChef;
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }
    let result = await portfolioRepo.duplicatePortfolio(chef_id, req.query);

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< duplicatePortfolio() error=${error}`);
    serverError(res);
  }
};

export const activeRecipe = async (req, res) => {
  logger.log(level.debug, `>> activeRecipe()`);
  let { chef_id } = req.currentChef;
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsJson(extraParams);
  try {
    let result = await portfolioRepo.activeRecipe(chef_id, options);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< activeRecipe() error=${error}`);
    serverError(res);
  }
};
