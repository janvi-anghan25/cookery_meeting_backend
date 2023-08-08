import { logger, level } from '../../config/logger';
import ratingsModel from '../../models/ratings';
import * as ratingPipeline from '../../aggregate_pipeline/chef/ratings';
import * as utilityFunctions from '../../utils/utility';
import { Mapping } from '../../services/database/database_schema_operation';

export const getRatings = async (chef_id, query, options) => {
  logger.log(level.info, `>> getRatings()`);
  let ratingsFilter = {
    chef_id,
  };
  if (query.rating_to) {
    ratingsFilter = {
      chef_id,
      rating_to: query.rating_to,
    };
  }
  let ratingsList = await ratingsModel.aggregate(
    ratingPipeline.pipelineForRatings(ratingsFilter, options)
  );
  let countPipeline = ratingPipeline.pipelineForRatings(
    ratingsFilter,
    {},
    true
  );

  let count = await utilityFunctions.getCountPipeline(
    ratingsModel,
    ratingsList,
    countPipeline
  );
  ratingsList = Mapping(ratingsList);
  let data = {
    message: 'succ_172',
    count,
    data: ratingsList,
  };
  return data;
};
