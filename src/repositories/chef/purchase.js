import { level, logger } from '../../config/logger';
import chefPurchasePlanModel from '../../models/package_purchase';
import * as utilityFunctions from '../../utils/utility';
import * as purchasePipeline from '../../aggregate_pipeline/chef/purchase';

export const packagePurchasedList = async (chef_id, options) => {
  logger.log(level.info, `>> packagePurchasedList()`);
  let filter = { chef_id };
  let purchasedList = await chefPurchasePlanModel.aggregate(
    purchasePipeline.getPipelineForPurchaseList(filter, options)
  );

  let countPipeline = purchasePipeline.getPipelineForPurchaseList(
    filter,
    {},
    true
  );

  let count = await utilityFunctions.getCountPipeline(
    chefPurchasePlanModel,
    purchasedList,
    countPipeline
  );
  let data = {
    message: 'succ_41',
    count,
    data: purchasedList,
  };
  return data;
};

export const packagePurchasedDetails = async (filter) => {
  logger.log(level.info, `>> packagePurchasedDetails()`);

  let [purchasedDetails] = await chefPurchasePlanModel.aggregate(
    purchasePipeline.getPipelineForPurchaseList(filter)
  );

  let data = {
    message: 'succ_42',
    data: purchasedDetails,
  };
  return data;
};
