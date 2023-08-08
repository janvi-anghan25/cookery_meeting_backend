import { level, logger } from '../../config/logger';
import {
  badRequestError,
  serverError,
  successResponse,
  getOptionsJson,
  standardStructureStringToJson,
} from '../../utils/utility';
import * as recipeOptRepo from '../../repositories/admin/recipe_options';
import { validationResult } from 'express-validator';

export const createRecipeOptions = async (req, res) => {
  logger.log(level.debug, `>> createRecipeOptions()`);
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await recipeOptRepo.createRecipeOptions(req.body);

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< createRecipeOptions() error=${error}`);
    serverError(res);
  }
};

export const getRecipeOptions = async (req, res) => {
  logger.log(level.debug, `>> getRecipeOptions()`);
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await recipeOptRepo.getRecipeOptions(req.query);

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getRecipeOptions() error=${error}`);
    serverError(res);
  }
};

export const deleteRecipeOptions = async (req, res) => {
  logger.log(level.debug, `>> deleteRecipeOptions()`);
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await recipeOptRepo.deleteRecipeOptions(req.query);

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< deleteRecipeOptions() error=${error}`);
    serverError(res);
  }
};

export const editRecipeOptions = async (req, res) => {
  logger.log(level.debug, `>> editRecipeOptions()`);
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await recipeOptRepo.editRecipeOptions(req.query, req.body);

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< editRecipeOptions() error=${error}`);
    serverError(res);
  }
};

export const getAllRecipeOptions = async (req, res) => {
  logger.log(level.debug, `>> getAllRecipeOptions()`);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsJson(extraParams);
  try {
    let result = await recipeOptRepo.getAllRecipeOptions(options);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getAllRecipeOptions() error=${error}`);
    serverError(res);
  }
};
