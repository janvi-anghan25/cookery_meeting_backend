import { level, logger } from '../../config/logger';
import {
  getOptionsPipelineJson,
  serverError,
  standardStructureStringToJson,
  successResponse,
} from '../../utils/utility';
import * as ratingsRepo from '../../repositories/chef/ratings';

export const getRatings = async (req, res) => {
  logger.log(level.debug, `>> getRatings()`);
  const { chef_id } = req.currentChef;
  const extraParams = standardStructureStringToJson(req.query);
  const options = getOptionsPipelineJson(extraParams);
  try {
    let result = await ratingsRepo.getRatings(chef_id, req.query, options);
    successResponse(res, result);
  } catch (error) {
    logger.log(level.error, `<< getRatings() error=${error}`);
    serverError(error);
  }
};
