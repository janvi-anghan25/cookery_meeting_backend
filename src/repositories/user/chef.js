import { level, logger } from '../../config/logger';

import chefModel from '../../models/chef';
import orderModel from '../../models/order';
import * as utilityFunctions from '../../utils/utility';
import * as chefPipeline from '../../aggregate_pipeline/user/chef';
import ratingsModel from '../../models/ratings';
import { Mapping } from '../../services/database/database_schema_operation';

export const getAllChef = async (filter, options) => {
  logger.log(level.info, `>> getAllChef()`);

  let chefList = await chefModel.aggregate(
    chefPipeline.getPipelineForChef(filter, options)
  );
  let countPipeline = chefPipeline.getPipelineForChef(filter, {}, true);
  let count = await utilityFunctions.getCountPipeline(
    chefModel,
    chefList,
    countPipeline
  );
  let data = {
    message: 'succ_131',
    count,
    data: chefList,
  };
  return data;
};

export const getChefDetails = async (chef_id) => {
  logger.log(level.info, `>> getChefDetails()`);
  let [chefData] = await chefModel.aggregate(
    chefPipeline.getChefDetailsPipeline(chef_id)
  );
  let data = {
    message: 'succ_132',
    data: chefData,
  };
  return data;
};

export const topChefList = async (top) => {
  logger.log(level.info, `>> topChefList()`);
  let topChefList = await chefModel.aggregate(
    chefPipeline.getPipelineForTopChefs(Number(top))
  );

  topChefList = Mapping(topChefList);

  let data = {
    message: 'succ_173',
    data: topChefList,
  };
  return data;
};

export const addRatingToChef = async (user_id, body, chef_id) => {
  logger.log(level.info, `>> addRatingToChef()`);
  let rating_to = 'CHEF';
  let orderFilter = {
    user_id,
    chef_id,
    refunded: false,
    status: 5,
  };
  let ratingsFilter = { chef_id, user_id, rating_to };

  let data = {};
  let errorExist = await handleErrorCheck(orderFilter, ratingsFilter);
  if (errorExist) return errorExist;

  let addRating = await ratingsModel.add({
    ...body,
    chef_id,
    user_id,
    rating_to,
  });
  data = {
    error: false,
    message: 'succ_171',
    data: addRating,
  };
  return data;
};

const handleErrorCheck = async (orderFilter, ratingsFilter) => {
  logger.log(level.info, `>> handleErrorCheck()`);

  let [userHadOrders, ratingExist] = await Promise.all([
    orderModel.isExist(orderFilter),
    ratingsModel.isExist(ratingsFilter),
  ]);
  let data = {};
  if (!userHadOrders) {
    data = { error: true, message: 'err_171' };
    return data;
  }

  if (ratingExist) {
    data = { error: true, message: 'err_172' };
    return data;
  }
};

export const getChefsRating = async (chef_id, options) => {
  logger.log(level.info, `>> getChefsRating()`);
  let chefRatingList = await ratingsModel.aggregate(
    chefPipeline.getPipelineForChefRating(chef_id, options)
  );
  let countPipeline = chefPipeline.getPipelineForChefRating(chef_id, {}, true);
  let count = await utilityFunctions.getCountPipeline(
    ratingsModel,
    chefRatingList,
    countPipeline
  );
  let data = {
    message: 'succ_172',
    count,
    data: chefRatingList,
  };
  return data;
};
