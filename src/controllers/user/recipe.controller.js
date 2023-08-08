import { level, logger } from '../../config/logger';
import {
  badRequestError,
  getOptionsJson,
  getOptionsPipelineJson,
  serverError,
  standardStructureStringToJson,
  successResponse,
} from '../../utils/utility';

import * as recipeRepo from '../../repositories/user/recipe';
import { validationResult } from 'express-validator';

export const getChefRecipes = async (req, res) => {
  logger.log(level.debug, `>> getChefRecipes()`);
  let errors = validationResult(req);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsPipelineJson(extraParams);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }
    let result = await recipeRepo.getChefRecipes(req.query.chef_id, options);

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getChefRecipes() error=${error}`);
    serverError(res);
  }
};

export const getAllRecipes = async (req, res) => {
  logger.log(level.debug, `>> getAllRecipes()`);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsJson(extraParams);
  try {
    let result = await recipeRepo.getAllRecipes(options);

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getAllRecipes() error=${error}`);
    serverError(res);
  }
};

export const getRecipeDetails = async (req, res) => {
  logger.log(level.debug, `>> getRecipeDetails()`);
  try {
    let result = await recipeRepo.getRecipeDetails(req.query.recipe_id);

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getRecipeDetails() error=${error}`);
    serverError(res);
  }
};

export const topRecipeList = async (req, res) => {
  logger.log(level.debug, `>> topRecipeList()`);
  try {
    let result = await recipeRepo.topRecipeList(req.query.top);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< topRecipeList() error=${error}`);
    serverError(res);
  }
};

export const addRatingToRecipe = async (req, res) => {
  logger.log(level.debug, `>> addRatingToRecipe()`);
  let { user_id } = req.currentUser;
  let errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await recipeRepo.addRatingToRecipe(
      user_id,
      req.query.recipe_id,
      req.body
    );

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< addRatingToRecipe() error=${error}`);
    serverError(res);
  }
};

export const getRecipeRatings = async (req, res) => {
  logger.log(level.debug, `>> getRecipeRatings()`);
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsPipelineJson(extraParams);
  let errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await recipeRepo.getRecipeRatings(
      req.query.recipe_id,
      options
    );
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getRecipeRatings() error=${error}`);
    serverError(res);
  }
};

export const getRecipeOptions = async (req, res) => {
  logger.log(level.debug, `>> getRecipeOptions()`);

  try {
    const recipeData = await recipeRepo.getRecipeOptions();
    successResponse(res, recipeData);
  } catch (error) {
    logger.log(level.info, `<< getRecipeOptions error=${error}`);
    serverError(res);
  }
};

export const searchRecipeByOptions = async (req, res) => {
  logger.log(level.debug, `>> searchRecipeByOptions()`);

  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsJson(extraParams);

  try {
    const recipeData = await recipeRepo.searchRecipeByOptions(
      req.query,
      options
    );
    successResponse(res, recipeData);
  } catch (error) {
    logger.log(level.error, `<< searchRecipeByOptions error=${error}`);
    serverError(res);
  }
};

export const searchAllRCP = async (req, res) => {
  logger.log(level.debug, `>> searchAllRCP()`);

  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsJson(extraParams);

  try {
    const recipeData = await recipeRepo.searchAllRCP(req.query, options);
    successResponse(res, recipeData);
  } catch (error) {
    logger.log(level.error, `<< searchAllRCP error=${error}`);
    serverError(res);
  }
};
