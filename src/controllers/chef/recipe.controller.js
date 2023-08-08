import { level, logger } from '../../config/logger';
import {
  badRequestError,
  serverError,
  successResponse,
  getOptionsJson,
  regexSpecialChar,
  standardStructureStringToJson,
} from '../../utils/utility';
import * as recipeRepo from '../../repositories/chef/recipe';
import { validationResult } from 'express-validator';

export const addRecipe = async (req, res) => {
  logger.log(level.debug, `>> addRecipe()`);
  const errors = validationResult(req);
  let { chef_id } = req.currentChef;
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await recipeRepo.addRecipe(chef_id, req.body, req.files);

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< addRecipe() error=${error}`);
    serverError(res);
  }
};

export const updateRecipe = async (req, res) => {
  logger.log(level.debug, `>> updateRecipe()`);
  let { chef_id } = req.currentChef;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await recipeRepo.updateRecipe(
      chef_id,
      req.query,
      req.body,
      req.files
    );

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< updateRecipe() error=${error}`);
    serverError(res);
  }
};

export const deleteRecipe = async (req, res) => {
  logger.log(level.debug, `>> deleteRecipe()`);

  let { chef_id } = req.currentChef;
  try {
    let result = await recipeRepo.deleteRecipe(chef_id, req.query);

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< deleteRecipe() error=${error}`);
    serverError(res);
  }
};

export const updateRecipeStatus = async (req, res) => {
  logger.log(level.debug, `>> updateRecipeStatus()`);
  const errors = validationResult(req);
  let { chef_id } = req.currentChef;
  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }

    let result = await recipeRepo.updateRecipeStatus(
      chef_id,
      req.query,
      req.body
    );

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< updateRecipeStatus() error=${error}`);
    serverError(res);
  }
};

export const getRecipe = async (req, res) => {
  logger.log(level.debug, `>> getRecipe()`);
  let { chef_id } = req.currentChef;
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      return badRequestError(res, errors);
    }
    let result = await recipeRepo.getRecipe(chef_id, req.query);

    if (result.error) {
      return badRequestError(res, result.message);
    }

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getRecipe() error=${error}`);
    serverError(res);
  }
};

export const getAllRecipes = async (req, res) => {
  logger.log(level.debug, `>> getAllRecipes()`);
  let { chef_id } = req.currentChef;
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsJson(extraParams);
  let filter = {};
  let regExpPattern;
  if (req.query.search) {
    regExpPattern = regexSpecialChar(req.query.search);
    filter = {
      $or: [
        { recipe_name: { $regex: regExpPattern, $options: 'i' } },
        { recipe_options: { $regex: regExpPattern, $options: 'i' } },
      ],
    };
  }
  filter.chef_id = chef_id;

  if (req.query.active_recipe) filter.status = 1;

  try {
    let result = await recipeRepo.getAllRecipes(filter, options);

    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getAllRecipes() error=${error}`);
    serverError(res);
  }
};
