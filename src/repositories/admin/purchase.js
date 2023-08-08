import { level, logger } from '../../config/logger';
import chefPurchasePlanModel from '../../models/package_purchase';
import * as purchasePipeline from '../../aggregate_pipeline/admin/package';
import { Mapping } from '../../services/database/database_schema_operation';

export const packagePurchasedList = async (options) => {
  logger.log(level.info, `>> packagePurchasedList()`);
  const packageType = 'PACKAGE';

  let [purchasedList, count] = await Promise.all([
    chefPurchasePlanModel.aggregate(
      purchasePipeline.pipelineForLatestUserPackageList(packageType, options)
    ),
    chefPurchasePlanModel.count({ type: packageType }),
  ]);

  purchasedList = Mapping(purchasedList);
  let data = {};
  if (purchasedList && purchasedList.length > 0) {
    data = {
      message: 'succ_41',
      count,
      data: purchasedList,
    };
    return data;
  }
  data = {
    message: 'succ_41',
    count: 0,
    data: [],
  };
  return data;
};

export const packagePurchasedDetails = async (purchase_id) => {
  logger.log(level.info, `>> packagePurchasedDetails()`);
  let [purchasedDetails] = await chefPurchasePlanModel.get({ purchase_id });

  let data = {
    message: 'succ_42',
    data: purchasedDetails,
  };
  return data;
};

export const promoPurchasedList = async (options) => {
  logger.log(level.info, `>> promoPurchasedList()`);
  const packageType = 'PROMO';

  let [purchasedList, count] = await Promise.all([
    chefPurchasePlanModel.aggregate(
      purchasePipeline.pipelineForLatestUserPackageList(packageType, options)
    ),
    chefPurchasePlanModel.count({ type: packageType }),
  ]);

  purchasedList = Mapping(purchasedList);
  let data = {};
  if (purchasedList && purchasedList.length > 0) {
    data = {
      message: 'succ_41',
      count,
      data: purchasedList,
    };
    return data;
  }
  data = {
    message: 'succ_41',
    count: 0,
    data: [],
  };
  return data;
};
