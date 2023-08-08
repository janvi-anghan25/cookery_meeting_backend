import { level, logger } from '../../config/logger';
import recipeOptionModel from '../../models/recipe_options';

export const createRecipeOptions = async (body) => {
  logger.log(level.info, `>> createRecipeOptions()`);
  body.category = JSON.parse(body.category);
  let addedOptions = await recipeOptionModel.add(body);

  let data = {
    message: 'succ_61',
    data: addedOptions,
  };
  return data;
};

export const getRecipeOptions = async (query) => {
  logger.log(level.info, `>> getRecipeOptions()`);
  let [getRecipeOptData] = await recipeOptionModel.get(query);
  let data = {
    message: 'succ_62',
    data: getRecipeOptData,
  };
  return data;
};

export const deleteRecipeOptions = async (query) => {
  logger.log(level.info, `>> deleteRecipeOptions()`);
  await recipeOptionModel.delete(query);
  let data = {
    message: 'succ_63',
  };
  return data;
};

export const editRecipeOptions = async (query, body) => {
  logger.log(level.info, `>> editRecipeOptions()`);
  if (body.category) {
    body.category = JSON.parse(body.category);
  }
  await recipeOptionModel.update(query, { $set: body });
  let data = {
    message: 'succ_64',
  };
  return data;
};

export const getAllRecipeOptions = async (options) => {
  logger.log(level.info, `>> getAllRecipeOptions()`);
  let [getAllRecipeOptData, count] = await Promise.all([
    recipeOptionModel.get({}, '', options),
    recipeOptionModel.count({}),
  ]);
  let data = {};

  if (getAllRecipeOptData && getAllRecipeOptData.length > 0) {
    data = {
      message: 'succ_65',
      count,
      data: getAllRecipeOptData,
    };
    return data;
  }
  data = {
    message: 'succ_65',
    count: 0,
    data: [],
  };
  return data;
};
