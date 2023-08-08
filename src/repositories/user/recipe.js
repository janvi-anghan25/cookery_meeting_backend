import { level, logger } from '../../config/logger';
import ratingsModel from '../../models/ratings';
import recipeModel from '../../models/recipe';
import portfolioModel from '../../models/portfolio';
import recipeOptionsModel from '../../models/recipe_options';
import chefModel from '../../models/chef';
import * as recipePipeline from '../../aggregate_pipeline/user/recipe';
import * as utilityFunctions from '../../utils/utility';

export const getChefRecipes = async (chef_id, options) => {
  logger.log(level.info, `>> getChefRecipes()`);
  const recipeFilter = {
    chef_id,
    status: 1,
  };

  let chefRecipes = await recipeModel.aggregate(
    recipePipeline.getPipelineForChefRecipe(recipeFilter, options)
  );

  let countPipeline = recipePipeline.getPipelineForChefRecipe(
    recipeFilter,
    {},
    true
  );

  let count = await utilityFunctions.getCountPipeline(
    recipeModel,
    chefRecipes,
    countPipeline
  );
  let data = {};
  if (chefRecipes && chefRecipes.length > 0) {
    data = {
      message: 'succ_75',
      count,
      data: chefRecipes,
    };
    return data;
  }
  data = {
    message: 'succ_75',
    count: 0,
    data: [],
  };
  return data;
};

export const getAllRecipes = async (options) => {
  logger.log(level.info, `>> getAllRecipes()`);
  let [allRecipes, count] = await Promise.all([
    recipeModel.get({ status: 1 }, '', options),
    recipeModel.count({ status: 1 }),
  ]);
  let data = {};
  if (allRecipes && allRecipes.length > 0) {
    data = {
      message: 'succ_75',
      count,
      data: allRecipes,
    };
    return data;
  }
  data = {
    message: 'succ_75',
    count: 0,
    data: [],
  };
  return data;
};

export const getRecipeDetails = async (recipe_id) => {
  logger.log(level.info, `>> getRecipeDetails()`);

  const filterRecipe = { recipe_id, status: 1 };

  let recipeDetails = await recipeModel.aggregate(
    recipePipeline.recipeDetailsPipeline(filterRecipe)
  );

  let data = {};
  if (recipeDetails && recipeDetails.length > 0) {
    recipeDetails = recipeDetails[0];
    data = {
      error: false,
      message: 'succ_72',
      data: recipeDetails,
    };
    return data;
  }
  data = {
    error: true,
    message: 'err_74',
  };
  return data;
};

export const topRecipeList = async (top) => {
  logger.log(level.info, `>> topRecipeList()`);
  let topRecipeList = await recipeModel.aggregate(
    recipePipeline.getPipelineForTopRecipes(Number(top))
  );

  let data = {
    message: 'succ_173',
    data: topRecipeList,
  };
  return data;
};

export const addRatingToRecipe = async (user_id, recipe_id, body) => {
  logger.log(level.info, `>> addRatingToRecipe()`);
  let rating_to = 'RECIPE';

  const [recipeData] = await recipeModel.get({ recipe_id });
  let addData = {
    ...body,
    user_id,
    recipe_id,
    rating_to,
    chef_id: recipeData.chef_id,
  };
  let data = {};

  let ratingExist = await ratingsModel.isExist({ user_id, recipe_id });
  if (ratingExist) {
    data = {
      error: true,
      message: 'err_172',
    };
    return data;
  }

  let addedRating = await ratingsModel.add(addData);
  data = {
    error: false,
    message: 'succ_171',
    data: addedRating,
  };
  return data;
};

export const getRecipeRatings = async (recipe_id, options) => {
  logger.log(level.info, `>> getRecipeRatings()`);
  let ratingList = await ratingsModel.aggregate(
    recipePipeline.getPipelineForRecipeRating(recipe_id, options)
  );

  let countPipeline = recipePipeline.getPipelineForRecipeRating(
    recipe_id,
    {},
    true
  );

  let count = await utilityFunctions.getCountPipeline(
    ratingsModel,
    ratingList,
    countPipeline
  );
  let data = {
    message: 'succ_172',
    count,
    data: ratingList,
  };
  return data;
};

export const getRecipeOptions = async () => {
  logger.log(level.info, `>> getRecipeOptions()`);

  let data = {};
  const recipeData = await recipeOptionsModel.get();
  const count = await recipeOptionsModel.count({});

  data = {
    message: 'succ_75',
    count: count,
    data: recipeData,
  };
  return data;
};

export const searchRecipeByOptions = async (query, options) => {
  logger.log(level.info, `>> searchRecipeByOptions()`);

  const { search } = query;

  let regExpPattern = new RegExp(search);

  let data = {};
  let filterRecipe = {
    recipe_options: { $regex: regExpPattern },
    status: 1,
  };

  const recipeData = await recipeModel.get(filterRecipe, '', options);
  const count = await recipeModel.count(filterRecipe);

  data = {
    message: 'succ_75',
    count: count,
    data: recipeData,
  };
  return data;
};

export const searchAllRCP = async (query, options) => {
  logger.log(level.info, `>> searchAllRcp()`);

  const { filter, search } = query;
  let regExpPattern = new RegExp(search);

  let filterRecipe = {
    status: 1,
  };

  let data = {};
  if (filter === 'recipe') {
    filterRecipe.recipe_name = { $regex: regExpPattern, $options: 'i' };
    const recipeData = await recipeModel.get(filterRecipe, '', options);
    const count = await recipeModel.count(filterRecipe);

    data = {
      message: 'succ_75',
      count: count,
      data: recipeData,
    };
  }

  if (filter === 'portfolio') {
    filterRecipe.portfolio_name = { $regex: regExpPattern, $options: 'i' };
    const portfolioData = await portfolioModel.get(filterRecipe, '', options);
    const count = await portfolioModel.count(filterRecipe);

    data = {
      message: 'succ_75',
      count: count,
      data: portfolioData,
    };
  }

  if (filter === 'chef') {
    filterRecipe.firstname = { $regex: regExpPattern, $options: 'i' };
    filterRecipe.publish_account = true;
    const chefData = await chefModel.get(filterRecipe, '', options);
    const count = await chefModel.count(filterRecipe);

    data = {
      message: 'succ_75',
      count: count,
      data: chefData,
    };
  }
  return data;
};
