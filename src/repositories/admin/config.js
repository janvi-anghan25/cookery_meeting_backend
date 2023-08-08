import { level, logger } from '../../config/logger';
import configModel from '../../models/config';

export const addConfigData = async (body) => {
  logger.log(level.info, `>> addConfigData()`);
  let addedConfig = await configModel.update({}, { $set: body });
  let data = {
    message: 'succ_84',
    data: addedConfig,
  };
  return data;
};

export const getConfigData = async () => {
  logger.log(level.info, `>> getConfigData()`);
  let configData = await configModel.get({});
  if (configData && configData.length > 0) {
    let data = {
      message: 'succ_85',
      data: configData[0],
    };
    return data;
  }
  let data = {
    message: 'succ_85',
    data: [],
  };
  return data;
};
