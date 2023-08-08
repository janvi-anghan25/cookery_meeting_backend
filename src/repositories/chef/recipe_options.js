import { level, logger } from '../../config/logger';
import recipeOptionModel from '../../models/recipe_options';

export const getRecipeOptions = async (query) => {
  logger.log(level.info, `>> getRecipeOptions()`);
  let [getRecipeOptData] = await recipeOptionModel.get(query);
  let data = {
    message: 'succ_62',
    data: getRecipeOptData,
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
