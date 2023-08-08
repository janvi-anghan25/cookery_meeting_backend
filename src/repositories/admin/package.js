import * as packagePipeline from '../../aggregate_pipeline/admin/package';
import { level, logger } from '../../config/logger';
import packageModel from '../../models/package';
import chefPurchasePlanModel from '../../models/package_purchase';
import * as utilityFunctions from '../../utils/utility';

export const createPackage = async (body) => {
  logger.log(level.info, `>> createPackage()`);

  let addPackage = await packageModel.add(body);

  let data = {
    message: 'succ_21',
    data: addPackage,
  };
  return data;
};

export const getPackageDetails = async (query) => {
  logger.log(level.info, `>> getPackageDetails()`);

  let packageDetails = await packageModel.get(query);
  let data = {};
  if (packageDetails && packageDetails.length > 0) {
    packageDetails = packageDetails[0];
    data = {
      error: false,
      message: 'succ_23',
      data: packageDetails,
    };
    return data;
  }
  data = {
    error: true,
    message: 'err_24',
  };
  return data;
};

export const updatePackage = async (status, query) => {
  logger.log(level.info, `>> updatePackage()`);

  // ? Update status
  await packageModel.update(query, { $set: { status } });
  let data = {
    error: false,
    message: 'succ_24',
  };
  return data;
};

export const deletePackage = async (query) => {
  logger.log(level.info, `>> deletePackage()`);
  let activeChef = await chefPurchasePlanModel.isExist({ ...query, status: 1 });
  let data = {};
  if (activeChef) {
    data = {
      error: true,
      message: 'err_30',
    };
    return data;
  }

  await packageModel.delete(query);
  data = {
    error: false,
    message: 'succ_25',
  };
  return data;
};

export const myPackageList = async (options) => {
  logger.log(level.info, `>> myPackageList()`);
  let packageList = await packageModel.aggregate(
    packagePipeline.getPackageListPipeline(options)
  );

  let countPipeline = packagePipeline.getPackageListPipeline({}, true);
  let count = await utilityFunctions.getCountPipeline(
    packageModel,
    packageList,
    countPipeline
  );

  let data = {
    count,
    message: 'succ_22',
    data: packageList,
  };
  return data;
};

export const setDefaultPackage = async (query) => {
  logger.log(level.info, `>> setDefaultPackage()`);
  await packageModel.updateMany(
    { is_default: true },
    { $set: { is_default: false } }
  );

  let setDefault = await packageModel.update(query, {
    $set: { is_default: true },
  });

  logger.log(level.info, `>> setDefaultPackage ${setDefault}`);

  let data = {
    error: false,
    message: 'succ_26',
  };
  return data;
};
